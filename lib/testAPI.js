const api = fetch('https://mshang.ca/syntree/?i=[S[NP[N%20Alice]][VP[V%20is][NP[N%27[N%20a%20student][PP^%20of%20physics')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });