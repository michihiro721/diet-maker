const apiUrl = 'https://dieter-ede02a96904c.herokuapp.com/api/v1/your_resources';

export const fetchResources = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};