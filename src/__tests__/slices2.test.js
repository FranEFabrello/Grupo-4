// __tests__/slices.test.js

// Mock expo-secure-store to avoid native errors
jest.mock('expo-secure-store', () => ({
  __esModule: true,
  AFTER_FIRST_UNLOCK: 'AFTER_FIRST_UNLOCK',
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock AsyncStorage default module and internal implementation
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));
jest.mock('@react-native-async-storage/async-storage/src/AsyncStorage', () =>
  require('@react-native-async-storage/async-storage').default
);

// Import slices and thunks
import appointmentsReducer, {
  clearAvailableTimeSlots,
  fetchAvailableDays,
  fetchAvailableTimeSlots,
  fetchAppointments,
  confirmAppointment,
  cancelAppointment,
} from '../store/slices/appointmentsSlice';
import authenticationReducer, { setToken, setIsAuthenticated } from '../store/slices/autheticationSlice';
import authReducer, { login, logout } from '../store/slices/authSlice';
import healthTipsReducer, { fetchHealthTips } from '../store/slices/healthTipsSlice';
import insuranceReducer, { fetchInsurance } from '../store/slices/insuranceSlice';
import medicalNotesReducer, { fetchMedicalNotes } from '../store/slices/medicalNotesSlice';
import specialitiesReducer, { fetchSpecialities } from '../store/slices/medicalSpecialitiesSlice';
import notificationsReducer, {
  setNotifications,
  markAsRead,
  incrementUnreadCount,
} from '../store/slices/notificationSlice';
import professionalsReducer, { fetchProfessionals } from '../store/slices/professionalsSlice';
import profileReducer, { fetchProfile, updateProfile } from '../store/slices/profileSlice';

// Appointments Slice Tests
describe('Appointments Slice', () => {
  const initial = appointmentsReducer(undefined, {});
  it('should have correct initial state', () => {
    expect(initial).toEqual({
      availableDays: [],
      availableTimeSlots: [],
      appointmentsByUser: [],
      status: 'idle',
      error: null,
    });
  });

  it('should clear availableTimeSlots', () => {
    const state = { ...initial, availableTimeSlots: [1, 2] };
    expect(
      appointmentsReducer(state, clearAvailableTimeSlots()).availableTimeSlots
    ).toEqual([]);
  });

  it('should handle fetchAvailableDays lifecycle', () => {
    const loading = appointmentsReducer(initial, {
      type: fetchAvailableDays.pending.type,
    });
    expect(loading.status).toBe('loading');

    const days = ['2025-07-12'];
    const succeeded = appointmentsReducer(initial, {
      type: fetchAvailableDays.fulfilled.type,
      payload: days,
    });
    expect(succeeded.status).toBe('succeeded');
    expect(succeeded.availableDays).toEqual(days);

    const failed = appointmentsReducer(initial, {
      type: fetchAvailableDays.rejected.type,
      error: { message: 'err' },
    });
    expect(failed.status).toBe('failed');
    expect(failed.error).toBe('err');
  });

  it('should handle fetchAvailableTimeSlots lifecycle', () => {
    const loading = appointmentsReducer(initial, {
      type: fetchAvailableTimeSlots.pending.type,
    });
    expect(loading.status).toBe('loading');

    const slots = [{ start: '09:00' }];
    const succeeded = appointmentsReducer(initial, {
      type: fetchAvailableTimeSlots.fulfilled.type,
      payload: slots,
    });
    expect(succeeded.availableTimeSlots).toEqual(slots);
  });

  it('should handle fetchAppointments.fulfilled', () => {
    const appts = [{ id: 1, fecha: '2025-07-10' }];
    const result = appointmentsReducer(initial, {
      type: fetchAppointments.fulfilled.type,
      payload: appts,
    });
    expect(result.appointmentsByUser[0].id).toBe(1);
  });

  it('should handle confirmAppointment.fulfilled', () => {
    const state = {
      ...initial,
      appointmentsByUser: [{ id: 1, foo: 'old' }],
    };
    const payload = { id: 1, foo: 'new' };
    const result = appointmentsReducer(state, {
      type: confirmAppointment.fulfilled.type,
      payload,
    });
    expect(result.appointmentsByUser[0].foo).toBe('new');
  });

  it('should handle cancelAppointment.fulfilled', () => {
    const state = {
      ...initial,
      appointmentsByUser: [{ id: 2, estado: 'PENDIENTE' }],
    };
    const result = appointmentsReducer(state, {
      type: cancelAppointment.fulfilled.type,
      meta: { arg: 2 },
    });
    expect(result.appointmentsByUser[0].estado).toBe('CANCELADO');
  });
});

// Authentication Slice Tests
describe('Authentication Slice', () => {
  const initial = authenticationReducer(undefined, {});
  it('should have correct initial state', () => {
    expect(initial).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should set token and auth flag', () => {
    const state = authenticationReducer(initial, setToken('abc'));
    expect(state.token).toBe('abc');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle setIsAuthenticated', () => {
    const state = authenticationReducer(initial, setIsAuthenticated(true));
    expect(state.isAuthenticated).toBe(true);
  });
});

// Auth Slice Tests
describe('Auth Slice', () => {
  const initial = authReducer(undefined, {});
  it('should have correct initial state', () => {
    expect(initial).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('should login action', () => {
    const payload = { user: { id: 1 }, token: 'tk' };
    const state = authReducer(initial, login(payload));
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('tk');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should logout action', () => {
    const state = authReducer(initial, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

// Health Tips Slice Tests
describe('Health Tips Slice', () => {
  const initial = healthTipsReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ tips: [], status: 'idle', error: null });
  });

  it('should handle fetchHealthTips lifecycle', () => {
    const loading = healthTipsReducer(initial, {
      type: fetchHealthTips.pending.type,
    });
    expect(loading.status).toBe('loading');

    const data = [{ id: 't1' }];
    const succeeded = healthTipsReducer(initial, {
      type: fetchHealthTips.fulfilled.type,
      payload: data,
    });
    expect(succeeded.tips).toEqual(data);
  });
});

// Insurance Slice Tests
describe('Insurance Slice', () => {
  const initial = insuranceReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ insurance: null, status: 'idle', error: null });
  });

  it('should handle fetchInsurance fulfilled', () => {
    const payload = { name: 'Ins' };
    const state = insuranceReducer(initial, {
      type: fetchInsurance.fulfilled.type,
      payload,
    });
    expect(state.insurance).toEqual(payload);
  });
});

// Medical Notes Slice Tests
describe('Medical Notes Slice', () => {
  const initial = medicalNotesReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ notes: null, status: 'idle', error: null });
  });

  it('should handle fetchMedicalNotes fulfilled', () => {
    const payload = [{ note: 'n1' }];
    const state = medicalNotesReducer(initial, {
      type: fetchMedicalNotes.fulfilled.type,
      payload,
    });
    expect(state.notes).toEqual(payload);
  });
});

// Specialities Slice Tests
describe('Medical Specialities Slice', () => {
  const initial = specialitiesReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ specialities: [], loading: false, error: null });
  });

  it('should handle fetchSpecialities fulfilled', () => {
    const data = ['s1'];
    const state = specialitiesReducer(initial, {
      type: fetchSpecialities.fulfilled.type,
      payload: data,
    });
    expect(state.specialities).toEqual(data);
  });
});

// Notifications Slice Tests
describe('Notifications Slice', () => {
  const initial = notificationsReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ notificaciones: [], loading: false, error: null, unreadCount: 0 });
  });

  it('should set notifications and unreadCount', () => {
    const payload = [
      { id: 1, leida: false },
      { id: 2, leida: true },
    ];
    const state = notificationsReducer(initial, setNotifications(payload));
    expect(state.unreadCount).toBe(1);
  });

  it('should mark as read', () => {
    const start = {
      ...initial,
      notificaciones: [{ id: 3, leida: false }],
      unreadCount: 1,
    };
    const state = notificationsReducer(start, markAsRead(3));
    expect(state.unreadCount).toBe(0);
  });

  it('should increment unreadCount', () => {
    const state = notificationsReducer(initial, incrementUnreadCount());
    expect(state.unreadCount).toBe(1);
  });
});

// Professionals Slice Tests
describe('Professionals Slice', () => {
  const initial = professionalsReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ professionals: [], status: 'idle', error: null });
  });

  it('should handle fetchProfessionals fulfilled', () => {
    const data = [{ id: 1 }];
    const state = professionalsReducer(initial, {
      type: fetchProfessionals.fulfilled.type,
      payload: data,
    });
    expect(state.professionals).toEqual(data);
  });
});

// Profile Slice Tests
// ... existing profile tests above ...

describe('Results Slice', () => {
  // Import dynamically inside describe to avoid top-level import duplication
  const { default: resultsReducer, fetchResults } = require('../store/slices/resultsSlice');
  const initial = resultsReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ results: [], status: 'idle', error: null });
  });
  it('handles fetchResults lifecycle', () => {
    const loading = resultsReducer(initial, { type: fetchResults.pending.type });
    expect(loading.status).toBe('loading');
    const data = [{ id: 'r1' }];
    const succeeded = resultsReducer(initial, { type: fetchResults.fulfilled.type, payload: data });
    expect(succeeded.status).toBe('succeeded');
    expect(succeeded.results).toEqual(data);
    const failed = resultsReducer(initial, { type: fetchResults.rejected.type, error: { message: 'err' } });
    expect(failed.status).toBe('failed');
    expect(failed.error).toBe('err');
  });
});

describe('Social Works Slice', () => {
  const { default: socialWorksReducer, fetchObrasSociales } = require('../store/slices/socialWorksSlice');
  const initial = socialWorksReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ obrasSociales: [], obraSocialEspecifica: null, loading: false, error: null });
  });
  it('handles fetchObrasSociales lifecycle', () => {
    const loading = socialWorksReducer(initial, { type: fetchObrasSociales.pending.type });
    expect(loading.loading).toBe(true);
    const payload = [{ id: 'o1' }];
    const succeeded = socialWorksReducer(initial, { type: fetchObrasSociales.fulfilled.type, payload });
    expect(succeeded.loading).toBe(false);
    expect(succeeded.obrasSociales).toEqual(payload);
    const failed = socialWorksReducer(initial, { type: fetchObrasSociales.rejected.type, payload: 'err' });
    expect(failed.loading).toBe(false);
    expect(failed.error).toBe('err');
  });
});

describe('Token Slice', () => {
  const { default: tokenReducer, validarTokenRegistro, validarTokenCambioContrasenia, resetRegistroState } = require('../store/slices/tokenSlice');
  const initial = tokenReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ loading: false, error: null, registroResponse: null, cambioContraseniaResponse: null });
  });
  it('handles validarTokenRegistro lifecycle', () => {
    let state = tokenReducer(initial, { type: validarTokenRegistro.pending.type });
    expect(state.loading).toBe(true);
    const payload = { token: 'abc' };
    state = tokenReducer(initial, { type: validarTokenRegistro.fulfilled.type, payload });
    expect(state.loading).toBe(false);
    expect(state.registroResponse).toEqual(payload);
    state = tokenReducer(initial, { type: validarTokenRegistro.rejected.type, payload: 'err' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });
  it('should reset registro state', () => {
    const modified = { ...initial, registroResponse: { foo: 'bar' }, error: 'err', loading: true };
    const reset = tokenReducer(modified, resetRegistroState());
    expect(reset.loading).toBe(false);
    expect(reset.error).toBeNull();
    expect(reset.registroResponse).toBeNull();
  });
});

describe('User Slice', () => {
  const { default: userReducer, setModoOscuro, fetchUsuarios, fetchUserByToken } = require('../store/slices/userSlice');
  const initial = userReducer(undefined, {});
  it('initial state', () => {
    expect(initial).toEqual({ usuarios: [], usuario: null, modoOscuro: false, loading: false, error: null, webPushStatus: 'idle', webPushError: null });
  });
  it('should set dark mode', () => {
    const state = userReducer(initial, setModoOscuro(true));
    expect(state.modoOscuro).toBe(true);
  });
  it('handles fetchUsuarios lifecycle', () => {
    let state = userReducer(initial, { type: fetchUsuarios.pending.type });
    expect(state.loading).toBe(true);
    const payload = [{ id: 1 }];
    state = userReducer(initial, { type: fetchUsuarios.fulfilled.type, payload });
    expect(state.loading).toBe(false);
    expect(state.usuarios).toEqual(payload);
    state = userReducer(initial, { type: fetchUsuarios.rejected.type, payload: 'err' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });
  it('handles fetchUserByToken.fulfilled', () => {
    const user = { id: 2 };
    const state = userReducer(initial, { type: fetchUserByToken.fulfilled.type, payload: user });
    expect(state.usuario).toEqual(user);
  });
});
