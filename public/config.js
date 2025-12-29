// Configuration for mobile app
window.AppConfig = {
    // Server URL configuration for different environments
    
    SERVER_URL: window.location.origin, // Default: same origin
    
    // Auto-detect if running in mobile app
    IS_MOBILE_APP: window.Capacitor !== undefined,
    
    // Get the correct server URL
    getServerUrl: function() {
        // If running in Capacitor (mobile app), use production server
        if (this.IS_MOBILE_APP) {
            // PRODUCTION: Update this with your VPS IP or domain
            // return 'http://YOUR_VPS_IP:5050';        // Direct IP access
            // return 'https://your-domain.com';        // With domain + SSL
            // return 'http://your-domain.com';         // With domain (no SSL)
            
            // DEVELOPMENT: Local testing (current setting)
            return 'http://192.168.18.5:5050'; // ⚠️ CHANGE THIS TO YOUR VPS URL
        }
        return this.SERVER_URL;
    }
};