export default ({ config }) => {
  return {
    ...config,
    name: "Medic Book",
    slug: "medic-book",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/splash-icon-light.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./src/assets/splash-icon-light.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tuempresa.medicbook",
    },
    android: {
      package: "com.tuempresa.medicbook",
      adaptiveIcon: {
        foregroundImage: "./src/assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./src/assets/splash-icon-light.png",
    },
    extra: {
      // Aquí podés poner cosas si las necesitás en el futuro
    },
    plugins: [],
  };
};
