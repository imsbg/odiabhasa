document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // 2. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle active state
            question.classList.toggle('active');
            
            // Get corresponding answer div
            const answer = question.nextElementSibling;
            
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

});

// 3. Copy Text Functionality for Social Media Blocks
function copyText(button) {
    // Find the blockquote element preceding the button
    const blockquote = button.previousElementSibling;
    const textToCopy = blockquote.innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        button.style.backgroundColor = "#28a745"; // Green success override for B&W theme
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = ""; 
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Failed to copy text. Please select and copy manually.");
    });
}

// 4. Social Share Functions
const postUrl = "https://imsbg.github.io/odiabhasa/blog/2026/deepabali/en";
const postTitle = "The Sacred Flames of Odia Deepabali: Unraveling the Tradition of Badabadua Daka";

function shareWhatsApp() {
    const text = encodeURIComponent(postTitle + " \nRead more here: " + postUrl);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function shareSMS() {
    const text = encodeURIComponent(postTitle + " - " + postUrl);
    window.open(`sms:?&body=${text}`, '_self');
}

function shareInstagram() {
    navigator.clipboard.writeText(postUrl).then(() => {
        alert("Link copied to clipboard! \nYou can now open Instagram and paste it in your story or bio.");
        window.open('https://instagram.com', '_blank');
    }).catch(err => {
        alert("Here is the link to copy: " + postUrl);
    });
}
