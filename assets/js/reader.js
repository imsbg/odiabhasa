
document.addEventListener("DOMContentLoaded", () => {
    // 1. Unhide the reader controls (they are hidden by default for crawlers)
    const readerControls = document.getElementById('reader-controls');
    if (readerControls) {
        readerControls.style.display = 'block';
    }

    const pages = document.querySelectorAll('.book-page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageCounter = document.getElementById('pageCounter');
    
    let currentPageIndex = 0;
    const totalPages = pages.length;

    if (totalPages === 0) return; // Exit if the book has no pages

    // Helper function to convert English numbers to Odia numbers
    function convertToOdia(num) {
        const odiaNums = ['୦','୧','୨','୩','୪','୫','୬','୭','୮','୯'];
        return num.toString().split('').map(n => odiaNums[n] || n).join('');
    }

    // Function to update the visible page and button states
    function updateReader() {
        // Hide all pages, show only the current one
        pages.forEach((page, index) => {
            page.style.display = (index === currentPageIndex) ? 'block' : 'none';
        });

        // Enable/Disable buttons based on page position
        prevBtn.disabled = (currentPageIndex === 0);
        nextBtn.disabled = (currentPageIndex === totalPages - 1);
        
        // Add visual styling for disabled buttons
        prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
        nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
        prevBtn.style.cursor = prevBtn.disabled ? "not-allowed" : "pointer";
        nextBtn.style.cursor = nextBtn.disabled ? "not-allowed" : "pointer";

        // Update the Odia text counter (e.g., ପୃଷ୍ଠା ୧ / ୫)
        pageCounter.innerText = `ପୃଷ୍ଠା ${convertToOdia(currentPageIndex + 1)} / ${convertToOdia(totalPages)}`;
        
        // Scroll to the top of the content when changing pages
        const contentDiv = document.getElementById('reader-content');
        if(contentDiv) {
            window.scrollTo({ top: contentDiv.offsetTop - 20, behavior: 'smooth' });
        }
    }

    // Button Click Events
    prevBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            updateReader();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPageIndex < totalPages - 1) {
            currentPageIndex++;
            updateReader();
        }
    });

    // Initialize the reader
    updateReader();
});
