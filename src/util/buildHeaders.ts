export const buildHeaders = (accessToken: string) => ({
    "Authorization": `Bearer ${accessToken}`,
    "Accept": "application/vnd.fidor.de; version=1,text/json",
    "Content-Type": "application/json",
});