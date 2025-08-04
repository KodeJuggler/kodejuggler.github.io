async function fetchData(url) {
   try {
      const response = await fetch(url);

      if (!response.ok) {
         if (response.status === 404) {
            return "Page does not exist!";
         } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
         }
      }

      const data = await response.text();

      return data;
   } catch (error) {
      console.error('Fetch error:', error);
   }
}


// Function to handle the route
async function handleRoute() {
   contentDiv = document.getElementById('content');
   // Get the 'page' parameter from the URL
   const page = new URLSearchParams(window.location.search).get('page');

   // Check if 'page' parameter is provided
   if (page) {
      try {
         // Update the content of the div
         data = await fetchData(page);
         const parsedmd = marked.parse(data);
         contentDiv.innerHTML = parsedmd;
      } catch (error) {
         console.error('Fetch error:', error);
      }

   } else {
      main = "home.md";
      try {
         // Update the content of the div
         data = await fetchData(main);
         const parsedmd = marked.parse(data);
         contentDiv.innerHTML = parsedmd;
      } catch (error) {
         console.error('Fetch error:', error);
      }
   }
}

async function createLinks() {
   const sitemap = await fetch('sitemap.json').then(response => {
      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
      return response.json();
   });

   const sitemapArray = sitemap;

   const sitemapContainer = document.getElementById('sitemap-container'); // Assumes an element with id 'sitemap-container'

   if (!sitemapContainer) {
      console.error('sitemap-container element not found.');
      return;
   }


   sitemapArray.forEach(item => {
      const link = document.createElement('a');
      link.href = `index.html?page=${item.url}`; // Construct the link URL
      link.textContent = item.name; // Set the link text
      link.addEventListener('click', function (event) {
         console.log(`Link clicked for: ${item.name}`);
      });
      sitemapContainer.appendChild(link);
   });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', createLinks);

// Call the function when the page loads
window.onload = handleRoute;