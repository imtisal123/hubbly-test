import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our profile state
type ProfileState = {
  name?: string;
  gender?: string;
  religion?: string;
  ethnicity?: string;
  maritalStatus?: string;
  profilePicture?: string;
  age?: number | null;
  dateOfBirth?: string;
  [key: string]: any; // Allow for additional properties
};

// Define the actions we can dispatch
type ProfileAction = 
  | { type: 'UPDATE_PROFILE'; payload: Partial<ProfileState> }
  | { type: 'NORMALIZE_PROFILE'; payload: Partial<ProfileState> }
  | { type: 'RESET_PROFILE' };

// Create initial state with safe defaults
const initialState: ProfileState = {
  name: "", // Empty default to avoid hardcoding
  gender: "",
  religion: "",
  ethnicity: "",
  maritalStatus: "",
  profilePicture: ""
};

// Create the context
const ProfileContext = createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Helper function to normalize profile data (handle both camelCase and snake_case)
const normalizeProfileData = (data: any): Partial<ProfileState> => {
  if (!data) return {};
  
  const normalized: Partial<ProfileState> = {};
  
  // Handle name field
  normalized.name = data.name || undefined;
  
  // Handle gender field
  normalized.gender = data.gender || undefined;
  
  // Handle religion field
  normalized.religion = data.religion || undefined;
  
  // Handle ethnicity field
  normalized.ethnicity = data.ethnicity || undefined;
  
  // Handle marital status (could be maritalStatus or marital_status)
  normalized.maritalStatus = data.maritalStatus || data.marital_status || undefined;
  
  // Handle profile picture (could be profilePicture, profile_pic_url, or image)
  normalized.profilePicture = data.profilePicture || data.profile_pic_url || data.image || undefined;
  
  // Handle age field
  normalized.age = data.age || undefined;
  
  // Handle date of birth (could be dateOfBirth or date_of_birth)
  normalized.dateOfBirth = data.dateOfBirth || data.date_of_birth || undefined;
  
  // Include any other fields from the original data
  Object.keys(data).forEach(key => {
    if (key !== 'name' && key !== 'gender' && key !== 'religion' && key !== 'ethnicity' && 
        key !== 'maritalStatus' && key !== 'marital_status' && 
        key !== 'profilePicture' && key !== 'profile_pic_url' && key !== 'image' && 
        key !== 'age' && key !== 'dateOfBirth' && key !== 'date_of_birth') {
      normalized[key] = data[key];
    }
  });
  
  return normalized;
};

// Create the reducer
function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      // Log the payload for debugging
      console.log('ProfileContext UPDATE_PROFILE action with payload:', JSON.stringify(action.payload, null, 2));
      
      // Filter out undefined and null values from the payload
      const filteredPayload = Object.fromEntries(
        Object.entries(action.payload).filter(([_, value]) => value !== undefined && value !== null)
      );
      
      // Only update if we have valid data to update with
      if (Object.keys(filteredPayload).length === 0) {
        console.log('No valid data in payload, skipping update');
        return state;
      }
      
      // Create the updated state
      const updatedState = {
        ...state,
        ...filteredPayload,
      };
      
      // Log the before and after states for debugging
      console.log('ProfileContext state BEFORE update:', JSON.stringify(state, null, 2));
      console.log('ProfileContext state AFTER update:', JSON.stringify(updatedState, null, 2));
      
      // Save to AsyncStorage for persistence
      try {
        AsyncStorage.setItem('profileData', JSON.stringify(updatedState));
      } catch (error) {
        console.error('Error saving profile to AsyncStorage:', error);
      }
      
      return updatedState;
      
    case 'NORMALIZE_PROFILE':
      // Normalize the profile data to handle both camelCase and snake_case
      const normalizedPayload = normalizeProfileData(action.payload);
      console.log('Normalized profile payload:', JSON.stringify(normalizedPayload, null, 2));
      
      // Filter out undefined values
      const filteredNormalizedPayload = Object.fromEntries(
        Object.entries(normalizedPayload).filter(([_, value]) => value !== undefined)
      );
      
      // Only update if we have valid data
      if (Object.keys(filteredNormalizedPayload).length === 0) {
        console.log('No valid data in normalized payload, skipping update');
        return state;
      }
      
      // Create the updated state with normalized data
      const normalizedState = {
        ...state,
        ...filteredNormalizedPayload,
      };
      
      // Log the normalized state
      console.log('ProfileContext state after normalization:', JSON.stringify(normalizedState, null, 2));
      
      // Save to AsyncStorage for persistence
      try {
        AsyncStorage.setItem('profileData', JSON.stringify(normalizedState));
      } catch (error) {
        console.error('Error saving normalized profile to AsyncStorage:', error);
      }
      
      return normalizedState;
      
    case 'RESET_PROFILE':
      console.log('ProfileContext RESET_PROFILE action');
      // Clear from AsyncStorage
      try {
        AsyncStorage.removeItem('profileData');
      } catch (error) {
        console.error('Error removing profile from AsyncStorage:', error);
      }
      return initialState;
      
    default:
      return state;
  }
}

// Create the provider component
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Load profile data from AsyncStorage on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profileData');
        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
        }
      } catch (error) {
        console.error('Error loading profile from AsyncStorage:', error);
      }
    };
    
    loadProfileData();
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log('ProfileContext state updated:', JSON.stringify(state, null, 2));
    // Log specific fields for easier debugging
    console.log('ProfileContext name field:', state.name || 'Not set');
    console.log('ProfileContext gender field:', state.gender || 'Not set');
    console.log('ProfileContext religion field:', state.religion || 'Not set');
    console.log('ProfileContext ethnicity field:', state.ethnicity || 'Not set');
    console.log('ProfileContext maritalStatus field:', state.maritalStatus || 'Not set');
    console.log('ProfileContext profilePicture field:', state.profilePicture || 'Not set');
  }, [state]);

  // Ensure we always have a valid state object
  const safeState = state || initialState;

  return (
    <ProfileContext.Provider value={{ state: safeState, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
}

// Create a custom hook for using the profile context
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    // This makes the hook more resilient when used outside a provider
    console.warn('useProfile was used outside of a ProfileProvider');
    return { state: initialState, dispatch: () => null };
  }
  
  // Wrap the dispatch function to add some debugging
  const enhancedDispatch = (action: ProfileAction) => {
    console.log('useProfile dispatch called with action:', JSON.stringify(action, null, 2));
    return context.dispatch(action);
  };
  
  return { 
    state: context.state,
    dispatch: enhancedDispatch
  };
}

// Export the context for direct use if needed
export default ProfileContext;
