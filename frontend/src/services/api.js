/**
 * API Service for Campus Navigator
 * Calls Express REST API with graceful error handling and local fallback if needed.
 */

const API_BASE = '/api';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend health check error:', err.message);
    return { status: 'offline', error: err.message };
  }
}

export async function fetchLocations(options = {}) {
  const params = new URLSearchParams();
  if (options.includeJunctions) params.append('includeJunctions', 'true');
  if (options.category) params.append('category', options.category);
  if (options.search) params.append('search', options.search);

  const url = `${API_BASE}/locations${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch campus locations: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchCampusGraph() {
  const res = await fetch(`${API_BASE}/locations/graph/all`);
  if (!res.ok) {
    throw new Error(`Failed to fetch campus graph: ${res.statusText}`);
  }
  return await res.json();
}

export async function calculateRoute({ startId, destinationId, accessibleOnly = false }) {
  const res = await fetch(`${API_BASE}/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startId,
      destinationId,
      accessibleOnly
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Route calculation failed');
  }
  return data;
}

export async function fetchLocationById(id) {
  const res = await fetch(`${API_BASE}/locations/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch location details for ${id}`);
  }
  return await res.json();
}
