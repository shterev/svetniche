import { supabase } from '../../config/supabase';

/**
 * Fetch all markers from Supabase
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const fetchMarkers = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('inserted_at', { ascending: false });

    if (error) throw error;

    // Transform database format to component format
    const markers = data.map(marker => ({
      id: marker.id,
      lat: marker.lat,
      lng: marker.lng,
      address: marker.address,
      note: marker.note,
      createdAt: marker.inserted_at
    }));

    return { data: markers, error: null };
  } catch (error) {
    console.error('Error fetching markers:', error);
    return { data: null, error };
  }
};

/**
 * Create a new marker in Supabase
 * @param {Object} marker - Marker data
 * @param {number} marker.lat - Latitude
 * @param {number} marker.lng - Longitude
 * @param {string} marker.address - Address or location description
 * @param {string} marker.note - Optional note
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createMarker = async ({ lat, lng, address, note = null }) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          lat,
          lng,
          address,
          note
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Transform database format to component format
    const marker = {
      id: data.id,
      lat: data.lat,
      lng: data.lng,
      address: data.address,
      note: data.note,
      createdAt: data.inserted_at
    };

    return { data: marker, error: null };
  } catch (error) {
    console.error('Error creating marker:', error);
    return { data: null, error };
  }
};

/**
 * Update a marker in Supabase
 * @param {number} id - Marker ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateMarker = async (id, updates) => {
  try {
    const dbUpdates = {};
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.lat !== undefined) dbUpdates.lat = updates.lat;
    if (updates.lng !== undefined) dbUpdates.lng = updates.lng;
    if (updates.note !== undefined) dbUpdates.note = updates.note;

    const { data, error } = await supabase
      .from('reports')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Transform database format to component format
    const marker = {
      id: data.id,
      lat: data.lat,
      lng: data.lng,
      address: data.address,
      note: data.note,
      createdAt: data.inserted_at
    };

    return { data: marker, error: null };
  } catch (error) {
    console.error('Error updating marker:', error);
    return { data: null, error };
  }
};

/**
 * Delete a marker from Supabase
 * @param {number} id - Marker ID
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteMarker = async (id) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting marker:', error);
    return { success: false, error };
  }
};
