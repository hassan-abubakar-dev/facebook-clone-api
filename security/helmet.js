import helmet from "helmet";

const security = helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
});

export default security;