import { Switch, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import np from 'nprogress';

/**
 * Top level routes
 */
const RouteMap = [
  {
    path: '/add-employee',
    component: lazy(() => import('../../pages/add.employee')),
  },
  {
    path: '/add-many-employees',
    component: lazy(() => import('../../pages/add.many.employees')),
  },
  {
    path: '/list-employees',
    component: lazy(() => import('../../pages/list.employees')),
  },
  {
    path: '/send-email',
    component: lazy(() => import('../../pages/send.email')),
  },
  {
    path: '/',
    component: lazy(() => import('../../pages/index')),
    exact: true,
  },
];

/**
 * Simple page loading animation using nprogress.
 * This does not reflect the actual page size and progress, just start
 * and end indication.
 */
function PageLoadAnimation() {
  useEffect(() => {
    np.start();
    return () => {
      np.done();
    };
  });
  return <></>;
}

/**
 * Renders individual page asynchronously
 */
export default function () {
  return (
    <Switch>
      {RouteMap.map((route, index) => (
        <Route path={route.path} key={index} exact={route.exact}>
          <Suspense fallback={<PageLoadAnimation />}>
            <route.component />
          </Suspense>
        </Route>
      ))}
    </Switch>
  );
}
