const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');
const preview = document.getElementById('preview');
const runBtn = document.getElementById('runBtn');
const themeToggle = document.getElementById('themeToggle');
const expandBtns = document.querySelectorAll('.expand-btn');
const refreshBtn = document.getElementById('refreshBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const previewContainer = document.querySelector('.preview-container');
const body = document.body;

// Store the current preview state
let currentPreviewContent = '';

// Default code templates that will be displayed on every page load if there are no previous codes stored from previous time.
const defaultHTML = `<!--This Compiler is Made By K Rajtilak-->

<div class="container">
  <h1>Hello, World!</h1>
  <p>"Start coding and watch your ideas come to life..."</p>
</div>`;

const defaultCSS = `/* This Compiler is Made By K Rajtilak */

.container {
  text-align: center;
  padding: 2rem;
  font-family: sans-serif;
}

h1 {
  color: #0984e3;
}`;

const defaultJS = `//This Compiler is Made By K Rajtilak

document.querySelector('h1').addEventListener('click', () => {
  alert('Hello from Raj!');
});`;

// Initialize editors with default code
htmlEditor.value = defaultHTML;
cssEditor.value = defaultCSS;
jsEditor.value = defaultJS;


let isDarkMode = true;
themeToggle.textContent = '☀️';

themeToggle.addEventListener('click', (e) => {

    const x = e.clientX;
    const y = e.clientY;
    body.style.setProperty('--click-x', `${x}px`);
    body.style.setProperty('--click-y', `${y}px`);


    body.classList.add('theme-transition');
    body.classList.add('active');


    setTimeout(() => {
        isDarkMode = !isDarkMode;
        body.classList.toggle('dark-mode');
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkMode.toString());
    }, 150);


    setTimeout(() => {
        body.classList.remove('theme-transition', 'active');
    }, 600);
});


let isFullscreen = false;
fullscreenBtn.addEventListener('click', () => {
    isFullscreen = !isFullscreen;
    previewContainer.classList.toggle('fullscreen');
    fullscreenBtn.textContent = isFullscreen ? '⛶' : '⛶';
    
    const tempContent = currentPreviewContent;
    
    if (isFullscreen) {
        document.body.appendChild(previewContainer);
    } else {
        document.querySelector('.editor-container').appendChild(previewContainer);
    }
    
    requestAnimationFrame(() => {
        const previewDocument = preview.contentDocument;
        previewDocument.open();
        previewDocument.write(tempContent);
        previewDocument.close();
    });
});

// Compile and run code with error handling
function updatePreview() {
    const previewDocument = preview.contentDocument;
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    currentPreviewContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${css}
                /* Error styling */
                .error {
                    color: #ff4757;
                    padding: 1rem;
                    border-left: 4px solid #ff4757;
                    background: rgba(255, 71, 87, 0.1);
                    margin: 1rem 0;
                }
            </style>
        </head>
        <body>
            ${html}
            <script>
                try {
                    ${js}
                } catch (error) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error';
                    errorDiv.textContent = 'JavaScript Error: ' + error.message;
                    document.body.appendChild(errorDiv);
                }
            </script>
        </body>
        </html>
    `;

    previewDocument.open();
    previewDocument.write(currentPreviewContent);
    previewDocument.close();
}

// Event listeners
runBtn.addEventListener('click', () => {
    runBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        runBtn.style.transform = 'scale(1)';
        updatePreview();
    }, 100);
});

refreshBtn.addEventListener('click', () => { 
    }, 300);
;

// Auto-save functionality
const saveToLocalStorage = debounce(() => {
    localStorage.setItem('savedHTML', htmlEditor.value);
    localStorage.setItem('savedCSS', cssEditor.value);
    localStorage.setItem('savedJS', jsEditor.value);
}, 1000);

[htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('input', saveToLocalStorage);
});

// Load saved code and preferences
window.addEventListener('load', () => {
    const savedHTML = localStorage.getItem('savedHTML');
    const savedCSS = localStorage.getItem('savedCSS');
    const savedJS = localStorage.getItem('savedJS');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedHTML) htmlEditor.value = savedHTML;
    if (savedCSS) cssEditor.value = savedCSS;
    if (savedJS) jsEditor.value = savedJS;
    
    if (savedDarkMode !== null) {
        isDarkMode = savedDarkMode === 'true';
        if (!isDarkMode) {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    }

    updatePreview();
});


expandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.closest('.editor-panel');
        const panels = document.querySelectorAll('.editor-panel');
        
        panels.forEach(p => {
            if (p !== panel) {
                p.style.flex = '1';
                p.style.opacity = '0.7';
            }
        });
        
        if (panel.style.flex === '3') {
            panel.style.flex = '1';
            panel.style.opacity = '1';
            btn.textContent = '⌄';
            panels.forEach(p => p.style.opacity = '1');
        } else {
            panel.style.flex = '3';
            panel.style.opacity = '1';
            btn.textContent = '⌃';
        }
    });
});

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


[htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
        }
    });
});
