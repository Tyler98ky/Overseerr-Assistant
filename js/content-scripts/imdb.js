let overseerrContainer, imdbId, tmdbId, mediaType;

const anchorElement = 'div.WatchlistButton__ButtonParent-sc-1fmni0g-0.hbeiyJ';
const textClass = 'text-sm';
const containerClass = 'mt-2 py-2';
const requestCountBackground = '#313131';

const imdbRegex = /\/title\/(tt\d+)(?:\/|$).*/;
let matches = document.location.pathname.match(imdbRegex);
if (matches !== null && matches.length > 1) {
    imdbId = matches[1];
    console.log(`IMDb id: ${imdbId}`);

    let title = $('h1.TitleHeader__TitleText-sc-1wu6n3d-0.dxSWFG').text();

    initializeContainer();
    insertSpinner();

    pullStoredData(function () {
        chrome.runtime.sendMessage({contentScriptQuery: 'search', title: title}, json => {
            if (json.results.length === 0) {
                removeSpinner();
                insertStatusButton('Not found', 0);
                return;
            }
            const firstResult = json.results[0];
            mediaType = firstResult.mediaType;
            chrome.runtime.sendMessage({contentScriptQuery: 'queryMedia', tmdbId: firstResult.id, mediaType: mediaType}, json => {
                if (imdbId === json.externalIds.imdbId) {
                    tmdbId = json.id;
                    console.log(`TMDB id: ${tmdbId}`);
                    removeSpinner();
                    fillContainer(json.mediaInfo);
                } else {
                    removeSpinner();
                    insertStatusButton('Not found', 0);
                }
            });
        });
    });
}


