import Button from '@mui/material/Button';
import './favorite.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

const Favorite = () => {
    return (
        <div className="main-container">
            <header className="header">
                <div className="headerLogo">
                    <img src="/Images/LOGO.png" alt="Logo" style={{ height: 'auto' }} />
                </div>
                <button className="accBtn"
                    onClick={() => window.location.replace("http://www.google.com")}>
                    <FontAwesomeIcon icon={faUser} />
                    Account
                </button>
                <button className="logBtn">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                </button>
            </header>

            <main className="main-content">
                {/* Your favorites content goes here */}
                Favorites
                <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} />

                <p style={{ textAlign: 'center' }}>Your favorite items will appear here</p>
                <button className="backBtn">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </main>
        </div>
    );
};

export default Favorite;