import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.css';

const HEADER_HEIGHT = 100;

const AppHeader = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.headerRoot}>
      <img 
        src="/Images/LOGO.png" 
        alt="GameGenome Logo" 
        className={styles.logo} 
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')} 
      />
      <div className={styles.headerButtons}>
        <Button className={styles.headerIconBtn} onClick={() => navigate('/Account')}>
          <FontAwesomeIcon icon={faUser} />
        </Button>
        <Button className={styles.headerFavBtn} startIcon={<FontAwesomeIcon icon={faHeart} />} onClick={() => navigate('/Favorites')}>
          Favorite Games
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
export { HEADER_HEIGHT }; 