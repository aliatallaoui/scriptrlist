var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Api-Key", "3AQi9ysOlvV6ZsYyl5OiUe31ckl6XVndBcMRFHeY");

fetch('https://api-v1.riskblacklist.com/api/get_dashboard',{method: 'GET',headers: myHeaders})
  .then(response => response.json())
  .then(data => {
    // Update the DOM with the received data
    document.getElementById('totalUsers').textContent = data.totalUsers;
    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('totalDeliveredOrders').textContent = data.totalDeliveredOrders;

    // Update order sources
    const orderSourcesList = document.getElementById('orderSources');
    for (const source in data.orderSources) {
      const listItem = document.createElement('li');
      listItem.textContent = `${source}: ${data.orderSources[source]}`;
      orderSourcesList.appendChild(listItem);
    }

    // Update visitor URL statistics
    const visitorURLList = document.getElementById('visitorURLStatistics');
    for (const url in data.visitorURLStatistics) {
      const listItem = document.createElement('li');
      listItem.textContent = `${url}: ${data.visitorURLStatistics[url]}`;
      visitorURLList.appendChild(listItem);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
