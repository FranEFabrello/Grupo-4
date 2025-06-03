import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Linking, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Reemplaza con tu clave API de NewsAPI
const API_KEY = '4c9dab8cf2f24d3287780a7250edbd50';

export default function HealthTipsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { t,i18n } = useTranslation();


  const fetchHealthTips = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://newsapi.org/v2/everything?q=${t('articles.query')}&language=${t('articles.lang')}&domains=${t('articles.links')}&sortBy=publishedAt&page=${page}&pageSize=10&apiKey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || t('articles.alerts.no_articles_error'));
      }

      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...data.articles]);
      }

      // Determinar si hay más artículos para cargar
      setHasMore(data.articles.length === 10); // Si devuelve menos de 10, asumimos que no hay más
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthTips(1); // Cargar la primera página al montar el componente
  }, []);

  const loadMoreArticles = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchHealthTips(nextPage);
    }
  };

  const openArticle = (url) => {
    Linking.openURL(url).catch((err) => alert(t('articles.alerts.opening_error') + err.message));
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t('articles.title')}>
      <ScrollView
        className="p-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {error ? (
          <View className="bg-red-100 rounded-lg p-4 mb-4">
            <Text className="text-sm text-red-600">Error: {error}</Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-2 px-4 mt-2 flex-row justify-center items-center shadow-md"
              onPress={() => fetchHealthTips(1)}
            >
              <Text className="text-white text-sm font-semibold">{t('global.button.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : articles.length === 0 && !loading ? (
          <Text className="text-sm text-gray-600">{t('articles.alerts.no_articles')}</Text>
        ) : (
          articles.map((article, index) => (
            <TouchableOpacity
              key={`${article.url}-${index}`}
              className="bg-white rounded-xl p-4 mb-4 shadow-lg border border-gray-200"
              onPress={() => openArticle(article.url)}
            >
              {article.urlToImage && (
                <Image
                  source={{ uri: article.urlToImage }}
                  className="w-full h-40 rounded-lg mb-3"
                  resizeMode="cover"
                />
              )}
              <Text className="text-base font-bold text-gray-800 mb-1">{article.title}</Text>
              <Text className="text-xs text-gray-500 mb-2">
                {new Date(article.publishedAt).toLocaleDateString(i18n.language, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">{article.source.name}</Text>
              <Text className="text-sm text-gray-500 mb-2">{article.description || t('articles.alerts.no_description')}</Text>
              <Text className="text-xs text-blue-600 font-semibold">{t('articles.load_more')}</Text>
            </TouchableOpacity>
          ))
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#4a6fa5" className="my-10" />
        ) : hasMore ? (
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 mt-4 flex-row justify-center items-center shadow-md"
            onPress={loadMoreArticles}
          >
            <Text className="text-white text-sm font-semibold">{t('articles.load_more')}</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-sm text-gray-600 text-center mt-4">{t('articles.alerts.no_more_articles')}</Text>
        )}
      </ScrollView>
    </AppContainer>
  );
}