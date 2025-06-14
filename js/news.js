async function fetchStockNews() {
  const apiKey = 'NTfTXCOQGx1jBLWSsjP8TiyRwNTdUAIz47ME6Rw7';
  const newsContainer = document.getElementById('newsContent');
  const newsLoader = document.getElementById('newsLoader');

  newsLoader.style.display = 'block';
  newsContainer.innerHTML = '';

  try {
    const response = await fetch(`https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&limit=20&api_token=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const newsHTML = data.data.map(article => {
        // Format the date more nicely
        const publishedDate = new Date(article.published_at);
        const timeAgo = getTimeAgo(publishedDate);
        
        return `
          <div class="news-item">
            <div class="news-image-container">
              <img src="${article.image_url || 'https://via.placeholder.com/120x80/e9ecef/6c757d?text=News'}" 
                   alt="${article.title}" 
                   class="news-image"
                   onerror="this.src='https://via.placeholder.com/120x80/e9ecef/6c757d?text=News'">
            </div>
            <div class="news-content">
              <div class="news-header">
                <h3 class="news-title">${article.title}</h3>
                <div class="news-meta">
                  <span class="news-source">${article.source}</span>
                  <span class="news-date">${timeAgo}</span>
                </div>
              </div>
              <p class="news-description">${article.description || 'No description available.'}</p>
              <a href="${article.url}" target="_blank" class="news-link">Read full article →</a>
            </div>
          </div>
        `;
      }).join('');
      newsContainer.innerHTML = newsHTML;
    } else {
      newsContainer.innerHTML = '<p class="no-news">No news articles available at the moment.</p>';
    }
  } catch (error) {
    console.error('News fetch error:', error);
    newsContainer.innerHTML = `<p class="error-news">Error fetching news: ${error.message}</p>`;
  } finally {
    newsLoader.style.display = 'none';
  }
}

// Helper function to show time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
