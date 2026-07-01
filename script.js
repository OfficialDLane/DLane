// Advanced Database with actual payload content
const resourceDatabase = {
  songs: [
    { title: "Amazing Grace", author: "John Newton", copyright: "Public Domain", content: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see." },
    { title: "10,000 Reasons", author: "Matt Redman", copyright: "Atlas Music", content: "Bless the Lord, O my soul\nO my soul\nWorship His holy name\nSing like never before" },
    { title: "How Great Thou Art", author: "Stuart K. Hine", copyright: "Manna Music", content: "O Lord my God, When I in awesome wonder,\nConsider all the worlds Thy Hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed." }
  ],
  scriptures: [
    { title: "Genesis 1:1", author: "Moses", copyright: "Public Domain", content: "In the beginning God created the heaven and the earth." },
    { title: "John 3:16", author: "John", copyright: "Public Domain", content: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." }
  ],
  media: [],
  presentations: [],
  themes: [
    { title: "Default Dark Theme", author: "System", copyright: "2026", content: "[Theme Applied]" }
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

// State Management
let currentPreviewContent = "";
let selectedSong = null;
let currentCategory = "songs";

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

    loadCategoryData(e.target.getAttribute('data-tab'));
  });
});

// Broadcast Controls Logic
btnGoLive.addEventListener('click', () => {
  if (currentPreviewContent) {
    liveScreen.innerText = currentPreviewContent;
    liveScreen.style.backgroundColor = "#5e0000"; // Red tint for LIVE
    liveScreen.style.color = "#fff";
  }
});

btnBlack.addEventListener('click', () => {
  liveScreen.innerText = "";
  liveScreen.style.backgroundColor = "#000";
});

// Reset the Live Screen completely when Clear is clicked
btnClear.addEventListener("click", () => {
    liveScreen.innerText = "";
    liveScreen.style.backgroundColor = "#000";
    liveScreen.style.color = "#fff";
});

// Live System Clock Loop
function updateClock() {
  const now = new Date();
  systemClock.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);

// Search Songs with dynamic "No items found" feedback row
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

// Add Song (Refactored to use generic 'newItem')
btnAddSong.addEventListener("click", () => {
    if (currentCategory === "themes") {
        alert("Themes directory is read-only.");
        return;
    }

    const title = prompt("Song Title");
    if(!title) return;

    const author = prompt("Author") || "";
    const copyright = prompt("Copyright") || "";
    const lyrics = prompt("Lyrics") || "";

    const newItem = {
        title,
        author,
        copyright,
        content: lyrics
    };

    resourceDatabase[currentCategory].push(newItem);

    // Reload layout and target the new item for automatic focus configuration
    loadCategoryData(currentCategory, newItem);
    searchInput.value = ""; 
});

// Edit Song
btnEditSong.addEventListener("click", () => {
    if (currentCategory === "themes") {
        alert("Themes directory is read-only.");
        return;
    }

    if(selectedSong == null){
        alert("Please select an item.");
        return;
    }

    const newTitle = prompt("Title", selectedSong.title);
    if(newTitle !== null){
        selectedSong.title = newTitle;
    }

    const newAuthor = prompt("Author", selectedSong.author);
    if(newAuthor !== null){
        selectedSong.author = newAuthor;
    }

    const newCopyright = prompt("Copyright", selectedSong.copyright);
    if(newCopyright !== null){
        selectedSong.copyright = newCopyright;
    }

    const newContent = prompt("Lyrics", selectedSong.content);
    if(newContent !== null){
        selectedSong.content = newContent;
    }

    loadCategoryData(currentCategory, selectedSong);
});

// Delete Song (Finished with complete slate clearing and cache removal)
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

        loadCategoryData(currentCategory);
    }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  loadCategoryData('songs');
  updateClock();
});