from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from app.core.config import settings
import time
import os

class MongoDBSingleton:
    _instance = None
    _client: Optional[MongoClient] = None

    _max_reconnect_attempts = 5
    _reconnect_delay_seconds = 2
    _last_connection_check = 0
    _connection_check_interval = 30
    
    # Flag to control test behavior - set to True to disable test handling
    _disable_test_handling = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBSingleton, cls).__new__(cls)
            
            # Only initialize client when not in test environment or when test handling is disabled
            if not cls._is_test_environment() or cls._disable_test_handling:
                cls._instance._initialize_client()
        return cls._instance
    
    @classmethod
    def _is_test_environment(cls):
        """Check if we're in a test environment."""
        return 'PYTEST_CURRENT_TEST' in os.environ and not cls._disable_test_handling
    
    def _initialize_client(self):
        """Initialize MongoDB client with connection parameters."""
        if not settings.DB_CONNECTION_STRING:
            raise ValueError("MONGODB_URI environment variable is not set")
        
        try:
            # Initialize MongoDB client with connection parameters
            self._client = MongoClient(
                settings.DB_CONNECTION_STRING,
                maxPoolSize=100,
                minPoolSize=10,
                maxIdleTimeMS=30000,
                waitQueueTimeoutMS=2000,
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=30000,
                socketTimeoutMS=45000,
                retryWrites=True,
                retryReads=True,
                # Add heartbeat frequency to check the connection status
                heartbeatFrequencyMS=10000,
            )
            
            # Test connection
            self._client.admin.command('ping')
            print("MongoDB connection established successfully")
        except ConnectionFailure:
            print("MongoDB connection failed")
    
    @property
    def client(self) -> MongoClient:
        """Get the MongoDB client instance."""
        # In test environment with test handling enabled, raise error unless disabled
        if self._is_test_environment():
            raise ConnectionFailure("MongoDB client intentionally not initialized in test environment")
            
        if self._client is None:
            self._initialize_client()

        # Periodic connection check
        current_time = time.time()
        if current_time - self._last_connection_check > self._connection_check_interval:
            if not self._check_connection():
                if not self._reconnect():
                    raise ConnectionFailure("Cannot establish connection to MongoDB")
            self._last_connection_check = current_time
        return self._client
    
    def get_database(self, db_name: str):
        """Get a specific database."""
        # In test environment with test handling enabled, raise error unless disabled
        if self._is_test_environment():
            raise ConnectionFailure("MongoDB client intentionally not initialized in test environment")
        return self.client[db_name]
    
    def close(self):
        """Close the MongoDB connection."""
        if self._client:
            self._client.close()
            self._client = None
            MongoDBSingleton._instance = None
            print("MongoDB connection closed")
            
    def _check_connection(self):
        """Check if the MongoDB connection is alive."""
        if self._is_test_environment():
            return False
            
        try:
            self._client.admin.command('ping')
            return True
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            return False
        
    def _reconnect(self):
        """Attempt to reconnect to MongoDB with retry logic."""
        if self._is_test_environment():
            return False
            
        attempts = 0
        while attempts < self._max_reconnect_attempts:
            try:
                # Close existing client if it exists
                if self._client:
                    self._client.close()
                
                # Create a new client
                connection_string = settings.DB_CONNECTION_STRING
                self._client = MongoClient(
                    connection_string,
                    maxPoolSize=100,
                    minPoolSize=10,
                    maxIdleTimeMS=30000,
                    waitQueueTimeoutMS=2000,
                    serverSelectionTimeoutMS=10000,
                    connectTimeoutMS=30000,
                    socketTimeoutMS=45000,
                    retryWrites=True,
                    retryReads=True,
                    heartbeatFrequencyMS=10000
                )
                
                # Verify connection
                self._client.admin.command('ping')
                return True
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                attempts += 1
                if attempts < self._max_reconnect_attempts:
                    time.sleep(self._reconnect_delay_seconds)
        return False