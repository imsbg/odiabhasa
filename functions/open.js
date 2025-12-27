export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Get the part after the '?' (e.g., "Writing")
  let queryKey = url.search.substring(1);
  if (queryKey.includes('=')) {
      queryKey = queryKey.split('=')[0];
  }

  // Define your titles here (Server Side)
  const titleMap = {
      "Swara": "ସ୍ଵରବର୍ଣ୍ଣ",
      "Byanjana": "ବ୍ୟଞ୍ଜନବର୍ଣ୍ଣ",
      "Sankhya": "୧ ରୁ ୧୦୦ ସଂଖ୍ୟା",
      "Yukta": "ଯୁକ୍ତାକ୍ଷର ",
      "Barna_Parichaya": "ବର୍ଣ୍ଣ ପରିଚୟ",
      "Matra": "ମାତ୍ରା",
      "Phala": "ଫଳା",
      "Bahi": "ଓଡ଼ିଆ ବହି ",
      "Book_Reader": "ବହି ପଢନ୍ତୁ ",
      "Menu": "ମେନୁ ",
      "About": "ଆପ୍ ବିଷୟରେ ",
      "History_Odisha": "ଓଡ଼ିଶାର ଇତିହାସ ",
      "History_Lang": "ଓଡ଼ିଆ ଭାଷାର ଇତିହାସ ",
      "Lipyantara": "ଲିପ୍ୟନ୍ତର ",
      "Odia_Calendar": "ଓଡ଼ିଆ କ୍ୟାଲେଣ୍ଡର ",
      "Madhu_Barnabodha": "ମଧୁ ବର୍ଣ୍ଣବୋଧ ",
      "Writing": "ଓଡ଼ିଆ ଅକ୍ଷର ଲେଖି ଶିଖନ୍ତୁ"
  };

  // Default values
  let newTitle = "ଓଡ଼ିଆ ଭାଷା ଆପ୍";
  let newDesc = "ଆମ ଭାଷା, ଆମ ପରିଚୟ";

  // If the key exists, update title and description
  if (titleMap[queryKey]) {
      newTitle = titleMap[queryKey];
      newDesc = "ଏହାକୁ ଖୋଲିବା ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ: " + newTitle;
  }

  // 1. Get the original open.html content
  const response = await context.next();

  // 2. Use HTMLRewriter to swap the tags BEFORE WhatsApp sees them
  return new HTMLRewriter()
    .on('title', {
      element(e) { e.setInnerContent(newTitle); }
    })
    .on('meta[property="og:title"]', {
      element(e) { e.setAttribute("content", newTitle); }
    })
    .on('meta[property="og:description"]', {
      element(e) { e.setAttribute("content", newDesc); }
    })
    .transform(response);
}
