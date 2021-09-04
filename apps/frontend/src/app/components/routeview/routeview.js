import Container from 'react-bootstrap/Container';

import styles from './routeview.module.css';
import Routes from './routes';

export default function () {
  return (
    <Container fluid className={styles.routeView}>
      <Routes />
    </Container>
  );
}
