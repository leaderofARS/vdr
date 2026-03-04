module.exports = {
    apps: [
        {
            name: 'vdr-api',
            script: './src/server.js',
            cwd: './backend/api-server',
            instances: 'max',          // Use all CPU cores
            exec_mode: 'cluster',      // Cluster mode for load balancing
            max_memory_restart: '1G',
            env_production: {
                NODE_ENV: 'production',
                PORT: 3001
            },
            // Graceful shutdown
            kill_timeout: 10000,       // 10s grace period
            listen_timeout: 5000,
            // Restart policy
            max_restarts: 10,
            min_uptime: '10s',
            restart_delay: 4000,
            // Logging
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            error_file: './logs/api-error.log',
            out_file: './logs/api-out.log',
            merge_logs: true,
            // Health monitoring
            exp_backoff_restart_delay: 100
        }
    ]
};
