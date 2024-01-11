import app from './app'

const port = 3001;
export let updateInterval: NodeJS.Timeout;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
export default server;