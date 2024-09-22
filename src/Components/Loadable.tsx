import { Suspense, LazyExoticComponent, ComponentType } from 'react';
import { LinearProgressProps } from '@mui/material/LinearProgress';
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

// Define the LoaderProps interface to extend LinearProgressProps from Material-UI
interface LoaderProps extends LinearProgressProps {}

// Create the Loadable higher-order component
const Loadable = (
    Component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>
) => (props: LoaderProps) => (
    <Suspense fallback={<Loader {...props} />}>
        <Component {...props} />
    </Suspense>
);

// Export the Loadable component as the default export
export default Loadable;
