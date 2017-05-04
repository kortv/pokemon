export const getIdFromUrl = (url) => typeof url === 'string' ? url.replace(/^.*\/(\d+)\/$/, '$1') : ''
