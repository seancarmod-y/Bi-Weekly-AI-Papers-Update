document.addEventListener("DOMContentLoaded", () => {
    fetch('email_content.json')
        .then(response => response.json())
        .then(data => {
            // Directly set overall summary with AI-generated HTML
            document.getElementById('overall-summary').innerHTML = formatSummary(data.overall_summary);

            // Set closing message
            document.getElementById('closing-message').innerText = data.closing_message;

            // Populate papers
            const papersContainer = document.getElementById('papers');
            data.papers.forEach((paper, index) => {
                // Add week date heading for each set of papers
                if (index % 3 === 0) {
                    const weekHeading = document.createElement('h2');
                    weekHeading.innerText = `Papers from week of ${data.week_dates[Math.floor(index / 3)]}`;
                    papersContainer.appendChild(weekHeading);
                }

                const paperElement = document.createElement('div');
                paperElement.className = 'paper';

                // Check if YouTube link is available
                const youtubeLink = paper.youtube_link !== 'N/A' ? `<a href="${paper.youtube_link}" target="_blank">YouTube</a>` : '';

                // Create the HTML content for the paper
                paperElement.innerHTML = `
                    <h2>${formatTitle(paper.title.split(' - ')[0])}</h2>
                    <p>${capitalizeFirstLetter(paper.title.split(' - ')[1])}</p>
                    ${paper.figure && !paper.figure.startsWith("Error") ? `<a href="${paper.pdf_link}" target="_blank"><img src="${paper.figure}" alt="First figure of ${paper.title.split(' - ')[0]}"></a>` : '<p class="no-figure">No figure present for this paper.</p>'}
                    <p>
                        <a href="${paper.pdf_link}" target="_blank">PDF</a> |
                        <a href="${paper.tweet_link}" target="_blank">Tweet</a>
                        ${youtubeLink ? ' | ' + youtubeLink : ''}
                    </p>
                `;
                papersContainer.appendChild(paperElement);
            });
        })
        .catch(error => console.error('Error fetching the email content:', error));
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatSummary(summary) {
    // Remove any bullet points or stars and handle line breaks
    return summary.replace(/\*/g, '').replace(/\n\n/g, '<br>');
}

function formatTitle(title) {
    return title.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
