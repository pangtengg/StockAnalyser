async function fetchStockNews() {
  const apiKey = 'NTfTXCOQGx1jBLWSsjP8TiyRwNTdUAIz47ME6Rw7';
  const newsContainer = document.getElementById('newsContent');
  const newsLoader = document.getElementById('newsLoader');

  newsLoader.style.display = 'block';
  newsContainer.innerHTML = '';

  try {
    const response = await fetch(`https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&limit=10&api_token=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const newsHTML = data.data.map(article => `
        <div class="news-card">
          <div class="news-header">
            <img src="${article.image_url || 'https://via.placeholder.com/100'}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/100'">
            <div>
              <h4>${article.title}</h4>
              <p class="news-source">${article.source} • ${new Date(article.published_at).toLocaleDateString()}</p>
            </div>
          </div>
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank" class="news-link">Read full article</a>
        </div>
      `).join('');
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