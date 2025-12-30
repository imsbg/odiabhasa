export async function onRequest(context) {
  const url = new URL(context.request.url);
  const params = url.searchParams;

  // 1. Default App Metadata
  let newTitle = "ଓଡ଼ିଆ ଭାଷା ଆପ୍";
  let newDesc = "ଆମ ଭାଷା, ଆମ ପରିଚୟ | ଓଡ଼ିଆ ଶିଖିବା ପାଇଁ ଏକ ସମ୍ପୂର୍ଣ୍ଣ ଆପ୍";
  let newImage = "https://imsbg.github.io/odiabhasa/images/app.png"; // Default Logo

  // 2. Static Menu Titles (Your existing list)
  const titleMap = {
      "Swara": "ସ୍ଵରବର୍ଣ୍ଣ",
      "Byanjana": "ବ୍ୟଞ୍ଜନବର୍ଣ୍ଣ",
      "Sankhya": "୧ ରୁ ୧୦୦ ପର୍ଯ୍ୟନ୍ତ ସଂଖ୍ୟା",
      "Yukta": "ଯୁକ୍ତାକ୍ଷର ",
      "Barna_Parichaya": "ବର୍ଣ୍ଣ ପରିଚୟ",
      "Matra": "ମାତ୍ରା",
      "Phala": "ଫଳା",
      "Bahi": "ଓଡ଼ିଆ ବହି ",
      "Book_Reader": "ବହି ପଢିବା ",
      "Menu": "ମେନୁ ",
      "About": "ଆପ୍ ବିଷୟ ଖୋଲିବା ",
      "History_Odisha": "ଓଡ଼ିଶାର ଇତିହାସ ",
      "History_Lang": "ଓଡ଼ିଆ ଭାଷାର ଇତିହାସ ",
      "Lipyantara": "ଲିପ୍ୟନ୍ତର ",
      "Odia_Calendar": "ଓଡ଼ିଆ କ୍ୟାଲେଣ୍ଡର ",
      "Madhu_Barnabodha": "ଛବିଳ ମଧୁ ବର୍ଣ୍ଣବୋଧ ",
      "Writing": "ଓଡ଼ିଆ ଅକ୍ଷର ଲେଖି ଶିଖିବା"
  };

  // 3. Logic: Check what kind of link this is

  // CASE A: It is a specific Book (e.g., ?Bahi=amagouraba)
  if (params.has('Bahi') && params.get('Bahi') !== '') {
      const bookId = params.get('Bahi');
      
      try {
          // Construct the URL to your JSON file
          // Pattern: https://sbgb.pages.dev/ବହି/ଖାତା/[bookId].json
          const jsonUrl = `https://sbgb.pages.dev/ବହି/ଖାତା/${bookId}.json`;
          
          // Fetch the book details
          const bookRes = await fetch(jsonUrl);
          
          if (bookRes.ok) {
              const bookData = await bookRes.json();
              
              // Set dynamic metadata from JSON
              newTitle = bookData.title; // e.g. "ଆମ ଗୌରବ"
              newDesc = `ଲେଖକ: ${bookData.author} | ଓଡ଼ିଆ ଭାଷା ଆପ୍ ରେ ପଢ଼ନ୍ତୁ`;
              
              if (bookData.coverpage) {
                  newImage = bookData.coverpage; // e.g. "https://sbgb.pages.dev/.../amagouraba.jpg"
              }
          }
      } catch (err) {
          // If fetch fails, keep default values or generic "Odia Book" title
          newTitle = "ଓଡ଼ିଆ ବହି";
      }
  } 
  // CASE B: It is a static category (e.g., ?Swara)
  else {
      // Get the key from the query string (e.g., "Swara")
      let queryKey = url.search.substring(1);
      if (queryKey.includes('=')) {
          queryKey = queryKey.split('=')[0];
      }

      if (titleMap[queryKey]) {
          newTitle = titleMap[queryKey];
          newDesc = newTitle + " ଦେଖିବା ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ";
      }
  }

  // 4. Transform the HTML
  const response = await context.next();

  return new HTMLRewriter()
    // Update Title
    .on('title', {
      element(e) { e.setInnerContent(newTitle + " | ଓଡ଼ିଆ ଭାଷା"); }
    })
    // Update Open Graph Tags (Facebook, WhatsApp, LinkedIn)
    .on('meta[property="og:title"]', {
      element(e) { e.setAttribute("content", newTitle); }
    })
    .on('meta[property="og:description"]', {
      element(e) { e.setAttribute("content", newDesc); }
    })
    .on('meta[property="og:image"]', {
      element(e) { e.setAttribute("content", newImage); }
    })
    // Update Twitter Cards
    .on('meta[name="twitter:title"]', {
      element(e) { e.setAttribute("content", newTitle); }
    })
    .on('meta[name="twitter:description"]', {
      element(e) { e.setAttribute("content", newDesc); }
    })
    .on('meta[name="twitter:image"]', {
      element(e) { e.setAttribute("content", newImage); }
    })
    .transform(response);
}
