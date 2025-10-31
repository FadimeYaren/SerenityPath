let mentionCount = localStorage.getItem("mention") ? parseInt(localStorage.getItem("mention")) : 0;
document.getElementById("mention-count").innerText = mentionCount;

function increaseMention() {
    mentionCount++;
    document.getElementById("mention-count").innerText = mentionCount;
    localStorage.setItem("mention", mentionCount);
}

function resetMention() {
    mentionCount = 0;
    document.getElementById("mention-count").innerText = mentionCount;
    localStorage.setItem("mention", mentionCount);
}
