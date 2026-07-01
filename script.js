// Advanced Database with actual payload content
const resourceDatabase = {
  songs: [
    { title: "Amazing Grace", author: "John Newton", copyright: "Public Domain", content: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see." },
    { title: "10,000 Reasons", author: "Matt Redman", copyright: "Atlas Music", content: "Bless the Lord, O my soul\nO my soul\nWorship His holy name\nSing like never before\nO my soul, on this mountainous day\nAs I sing out my praise" },
    { title: "How Great Thou Art", author: "Stuart K. Hine", copyright: "Manna Music", content: "O Lord my God, When I in awesome wonder,\nConsider all the worlds Thy Hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed!" }
  ],
  scriptures: [
    { title: "Genesis 1:1", author: "Moses", copyright: "Public Domain", content: "In the beginning God created the heaven and the earth." },
    { title: "John 3:16", author: "John", copyright: "Public Domain", content: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." }
  ],
  media: [
    { title: "Welcome Slide", author: "Admin", copyright: "2026", content: "[Media: Welcome Banner Image]" },
    { title: "Hymn Background", author: "Admin", copyright: "2026", content: "[Media: Classical Hymn Background Video]" }
  ],
  presentations: [
    { title: "Sunday Service 2026", author: "Worship Team", copyright: "2026", content: "[Presentation: Multi-slide service flow]" },
    { title: "Easter Special", author: "Events Team", copyright: "2026", content: "[Presentation: Easter celebration slides]" }
  ],
  themes: [
    { title: "Default Dark Theme", author: "System", copyright: "2026", content: "[Theme Applied: Dark Blue]" },
    { title: "Light Theme", author: "System", copyright: "2026", content: "[Theme Applied: Light Gray]" },
    { title: "Christmas Theme", author: "System", copyright: "2026", content: "[Theme Applied: Red & Gold]" }
  ]
};

// UI DOM Selectors
const tableBody = document.getElementById('table-body');
const songCountDisplay = document.getElementById('song-count');
const tabButtons = document.querySelectorAll('.tab-btn');
const previewScreen = document.getElementById('preview-screen');
const miniPreview = document.getElementById('mini-preview');
const liveScreen = document.getElementById('live-screen');
const systemClock = document.getElementById('system-clock');

// Buttons
const btnGoLive = document.getElementById('btn-go-live');
const btnBlack = document.getElementById('btn-black');
const btnClear = document.getElementById('btn-clear');

// Resource Toolbar
const searchInput = document.getElementById("search-input");
const btnAddSong = document.getElementById("btn-add-song");
const btnEditSong = document.getElementById("btn-edit-song");
const btnDeleteSong = document.getElementById("btn-delete-song");

// Live Customization Controls
const liveFontSize = document.getElementById('live-font-size');
const liveFontDisplay = document.getElementById('live-font-display');
const liveTextColor = document.getElementById('live-text-color');
const liveBgColor = document.getElementById('live-bg-color');
const liveFadeEffect = document.getElementById('live-fade-effect');
const verseNumbering = document.getElementById('verse-numbering');
const btnResetDisplay = document.getElementById('btn-reset-display');

// State Management
let currentPreviewContent = "";
let selectedSong = null;
let currentCategory = "songs";
let verseCounter = 0;
let liveSettings = {
  fontSize: 24,
  textColor: '#ffffff',
  bgColor: '#000000',
  fadeEffect: 'none',
  verseMode: 'off'
};

// Helper function to get proper button labels based on category
function getButtonLabel(action, category) {
  const categoryLabels = {
    songs: { add: "➕ Add Song", edit: "✏ Edit Song", delete: "🗑 Delete Song" },
    scriptures: { add: "➕ Add Scripture", edit: "✏ Edit Scripture", delete: "🗑 Delete Scripture" },
    media: { add: "➕ Add Media", edit: "✏ Edit Media", delete: "🗑 Delete Media" },
    presentations: { add: "➕ Add Presentation", edit: "✏ Edit Presentation", delete: "🗑 Delete Presentation" },
    themes: { add: "➕ Add Theme", edit: "✏ Edit Theme", delete: "🗑 Delete Theme" }
  };
  return categoryLabels[category]?.[action] || `${action} Item`;
}

// Helper function to get proper prompt labels based on category
function getPromptLabels(category) {
  const labels = {
    songs: { title: "Song Title", author: "Artist/Composer", copyright: "Copyright Info", content: "Lyrics" },
    scriptures: { title: "Scripture Reference", author: "Book/Author", copyright: "Version", content: "Scripture Text" },
    media: { title: "Media Name", author: "Creator", copyright: "Copyright Info", content: "Description" },
    presentations: { title: "Presentation Title", author: "Author", copyright: "Copyright Info", content: "Description" },
    themes: { title: "Theme Name", author: "Designer", copyright: "Version", content: "Theme Description" }
  };
  return labels[category] || labels.songs;
}

// Function to handle database view updates
function loadCategoryData(category, selectItem = null) {
  currentCategory = category;
  tableBody.innerHTML = '';
  
  const items = resourceDatabase[category] || [];
  songCountDisplay.innerText = `${items.length} items`;

  if (items.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#666; padding: 20px;">Folder is empty</td></tr>`;
    return;
  }

  // Populate row content and add click listeners for preview routing
  items.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.author}</td>
      <td>${item.copyright}</td>
    `;
    
    // Automatically select item if explicitly targeted (e.g. newly created item)
    if (selectItem && selectItem === item) {
      row.classList.add('selected');
      selectedSong = item;
      currentPreviewContent = item.content;
      previewScreen.innerText = item.content;
      miniPreview.innerText = item.content;
      previewScreen.style.backgroundColor = "#002b5e";
      miniPreview.style.backgroundColor = "#002b5e";
    }
    
    // Interactive Selection Logic
    row.addEventListener('click', () => {
      // Remove selection from all rows
      document.querySelectorAll('#table-body tr').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected'); // Highlight current
      
      selectedSong = item;
      
      // Route content to preview screens
      currentPreviewContent = item.content;
      previewScreen.innerText = item.content;
      miniPreview.innerText = item.content;
      previewScreen.style.backgroundColor = "#002b5e"; // Visual cue it's ready
      miniPreview.style.backgroundColor = "#002b5e";
    });
    
    tableBody.appendChild(row);
  });
}

// Attach Event Listeners to UI Navigation Tabs
tabButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Reset Previews when switching tabs
    previewScreen.innerText = "Select an item to preview...";
    previewScreen.style.backgroundColor = "#000";
    miniPreview.innerText = "";
    miniPreview.style.backgroundColor = "#000";
    currentPreviewContent = "";
    selectedSong = null;
    if (searchInput) searchInput.value = "";

    const category = e.target.getAttribute('data-tab');
    loadCategoryData(category);
    
    // Update button labels dynamically based on selected tab
    updateButtonLabels(category);
  });
});

// Update button labels based on current category
function updateButtonLabels(category) {
  const isReadOnly = category === "themes";
  
  // Disable/Enable buttons if needed (themes are read-only)
  btnAddSong.disabled = isReadOnly;
  btnEditSong.disabled = isReadOnly;
  btnDeleteSong.disabled = isReadOnly;
  
  if (isReadOnly) {
    btnAddSong.style.opacity = "0.5";
    btnEditSong.style.opacity = "0.5";
    btnDeleteSong.style.opacity = "0.5";
  } else {
    btnAddSong.style.opacity = "1";
    btnEditSong.style.opacity = "1";
    btnDeleteSong.style.opacity = "1";
  }
}

// ========================================
// LIVE OUTPUT CUSTOMIZATION FUNCTIONS
// ========================================

function applyLiveSettings() {
  liveScreen.style.fontSize = liveSettings.fontSize + 'px';
  liveScreen.style.color = liveSettings.textColor;
  liveScreen.style.backgroundColor = liveSettings.bgColor;
}

// Font Size Control
liveFontSize.addEventListener('input', (e) => {
  liveSettings.fontSize = parseInt(e.target.value);
  liveFontDisplay.innerText = liveSettings.fontSize + 'px';
  applyLiveSettings();
});

// Text Color Control
liveTextColor.addEventListener('change', (e) => {
  liveSettings.textColor = e.target.value;
  applyLiveSettings();
});

// Background Color Control
liveBgColor.addEventListener('change', (e) => {
  liveSettings.bgColor = e.target.value;
  applyLiveSettings();
});

// Fade Effect Control
liveFadeEffect.addEventListener('change', (e) => {
  liveSettings.fadeEffect = e.target.value;
});

// Verse Numbering Control
verseNumbering.addEventListener('change', (e) => {
  liveSettings.verseMode = e.target.value;
  verseCounter = 0; // Reset counter when switching modes
});

// Reset Display Button
btnResetDisplay.addEventListener('click', () => {
  liveSettings.fontSize = 24;
  liveSettings.textColor = '#ffffff';
  liveSettings.bgColor = '#000000';
  liveSettings.fadeEffect = 'none';
  liveSettings.verseMode = 'off';
  
  liveFontSize.value = 24;
  liveFontDisplay.innerText = '24px';
  liveTextColor.value = '#ffffff';
  liveBgColor.value = '#000000';
  liveFadeEffect.value = 'none';
  verseNumbering.value = 'off';
  verseCounter = 0;
  
  applyLiveSettings();
});

// Function to format content with verse numbers
function formatContentWithVerse(content) {
  if (liveSettings.verseMode === 'off') {
    return content;
  }
  
  let prefix = '';
  if (liveSettings.verseMode === 'verse') {
    verseCounter++;
    prefix = `[Verse ${verseCounter}]\n`;
  } else if (liveSettings.verseMode === 'slide') {
    verseCounter++;
    prefix = `[Slide ${verseCounter}]\n`;
  }
  
  return prefix + content;
}

// Broadcast Controls Logic
btnGoLive.addEventListener('click', () => {
  if (currentPreviewContent) {
    let displayContent = formatContentWithVerse(currentPreviewContent);
    liveScreen.innerText = displayContent;
    
    applyLiveSettings();
    
    // Apply fade effect if selected
    if (liveSettings.fadeEffect === 'fade') {
      liveScreen.classList.remove('fade-in');
      void liveScreen.offsetWidth; // Trigger reflow
      liveScreen.classList.add('fade-in');
    }
  }
});

btnBlack.addEventListener('click', () => {
  liveScreen.innerText = "";
  liveScreen.style.backgroundColor = "#000";
  verseCounter = 0;
});

// Reset the Live Screen completely when Clear is clicked
btnClear.addEventListener("click", () => {
    liveScreen.innerText = "";
    liveScreen.style.backgroundColor = "#000";
    liveScreen.style.color = "#fff";
    verseCounter = 0;
});

// Live System Clock Loop
function updateClock() {
  const now = new Date();
  systemClock.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);

// Search functionality with dynamic "No items found" feedback
searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr:not(.no-results-row)");
    let visibleCount = 0;

    rows.forEach(row => {
        if(row.innerText.toLowerCase().includes(keyword)){
            row.style.display = "";
            visibleCount++;
        }else{
            row.style.display = "none";
        }
    });

    // Remove any older placeholder rows
    const existingPlaceholder = tableBody.querySelector(".no-results-row");
    if (existingPlaceholder) existingPlaceholder.remove();

    // If everything is filtered out, append notice
    if (visibleCount === 0 && rows.length > 0) {
        const placeholder = document.createElement("tr");
        placeholder.classList.add("no-results-row");
        placeholder.innerHTML = `<td colspan="3" style="text-align:center; color:#666; padding: 20px;">No items found.</td>`;
        tableBody.appendChild(placeholder);
    }
});

// Generic Add Item Handler (works for all categories)
btnAddSong.addEventListener("click", () => {
    if (currentCategory === "themes") {
        alert("Themes directory is read-only.");
        return;
    }

    const labels = getPromptLabels(currentCategory);
    
    const title = prompt(labels.title);
    if(!title) return;

    const author = prompt(labels.author) || "";
    const copyright = prompt(labels.copyright) || "";
    const content = prompt(labels.content) || "";

    const newItem = {
        title,
        author,
        copyright,
        content
    };

    resourceDatabase[currentCategory].push(newItem);

    // Reload layout and target the new item for automatic focus configuration
    loadCategoryData(currentCategory, newItem);
    searchInput.value = ""; 
});

// Generic Edit Item Handler (works for all categories)
btnEditSong.addEventListener("click", () => {
    if (currentCategory === "themes") {
        alert("Themes directory is read-only.");
        return;
    }

    if(selectedSong == null){
        alert("Please select an item.");
        return;
    }

    const labels = getPromptLabels(currentCategory);

    const newTitle = prompt(labels.title, selectedSong.title);
    if(newTitle !== null){
        selectedSong.title = newTitle;
    }

    const newAuthor = prompt(labels.author, selectedSong.author);
    if(newAuthor !== null){
        selectedSong.author = newAuthor;
    }

    const newCopyright = prompt(labels.copyright, selectedSong.copyright);
    if(newCopyright !== null){
        selectedSong.copyright = newCopyright;
    }

    const newContent = prompt(labels.content, selectedSong.content);
    if(newContent !== null){
        selectedSong.content = newContent;
    }

    loadCategoryData(currentCategory, selectedSong);
});

// Generic Delete Item Handler (works for all categories)
btnDeleteSong.addEventListener("click", () => {
    if (currentCategory === "themes") {
        alert("Themes directory is read-only.");
        return;
    }

    if(selectedSong == null){
        alert("Please select an item.");
        return;
    }

    if(confirm("Delete this item?")){
        resourceDatabase[currentCategory] =
            resourceDatabase[currentCategory].filter(item => item !== selectedSong);

        selectedSong = null;

        // Restore Previews and Live backgrounds securely to pure black slate state
        previewScreen.innerText = "Select an item to preview...";
        previewScreen.style.backgroundColor = "#000"; 
        
        miniPreview.innerText = "";
        miniPreview.style.backgroundColor = "#000";    
        
        liveScreen.innerText = "";
        liveScreen.style.backgroundColor = "#000";
        liveScreen.style.color = "#fff";

        currentPreviewContent = "";
        verseCounter = 0;

        loadCategoryData(currentCategory);
    }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  loadCategoryData('songs');
  updateButtonLabels('songs');
  updateClock();
});
