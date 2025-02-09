import React, { useEffect, useState } from 'react';
import { fetchResources } from '../api';

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const getResources = async () => {
      try {
        const data = await fetchResources();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    getResources();
  }, []);

  return (
    <div>
      <h1>Resources</h1>
      <ul>
        {resources.map(resource => (
          <li key={resource.id}>{resource.attribute1} - {resource.attribute2}</li>
        ))}
      </ul>
    </div>
  );
};

export default Resources;