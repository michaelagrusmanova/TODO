function sendApiRequest(request, options) {
    // odeslání požadavku pomocí Fetch API
    return (fetch(request, options).then(response => {
        // vyvolání výjimky při chybě
        if (!response.ok) {
            throw response;
        }

        // převod přijaté odpovědi na JSON
        return response.json();
               
    }));
}


function hasParam(request, key, value) {
    // nalezení parametru
    if (value != null && value !== '') {
        request.searchParams.append(key, value);
    }
}

/*
 * Odešle obecný požadavek.
 */
export const Api = (url, params, options) => {
    //const request = new URL(url, 'http://localhost:3000'); //PORT??

    // načtení nalezených parametrů URL dotazu
    Object.keys(params)
        .forEach(
            key => hasParam(url, key, params[key])
        );

    return sendApiRequest(url, options);
};

/*
 * Odešle GET požadavek se zadanými parametry.
 */
export const ApiGet = (url, params = {}) => {
    return Api(url, params, createRequestOptions('get'));
};

/*
 * Vytvoří přepravku s hodnotami konfigurace požadavku,
 * obsahuje použitou metodu, popř. hlavičku formátu a data.
 */
function createRequestOptions(method = 'get', body = {}) {
    let options = {'method': method};

    // nastavení formátu a dat pro POST a PUT metody
    if (['post', 'put'].includes(options.method)) {
        options['headers'] = {'Content-Type': 'application/json'};
        options['body'] = JSON.stringify(body);
    }

    return options;
}

/*
 * Odešle POST požadavek s požadovanými údaji pro vytvoření záznamu.
 */
export const ApiPost = (url, body) => {
    return Api(url, {}, createRequestOptions('post', body));
};

/*
 * Odešle PUT požadavek se zvolenými údaji pro úpravu záznamu.
 */
export const ApiPut = (url, body = {}) => {
    return Api(url, {}, createRequestOptions('put', body));
};

/*
 * Odešle DELETE požadavek pro odstranění záznamu.
 */
export const ApiDelete = (url) => {
    return Api(url, {}, createRequestOptions('delete'));
};

export default Api;