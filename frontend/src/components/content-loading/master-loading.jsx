import { Spin } from 'antd';
const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};
const content = <div style={contentStyle} />;

const MasterLoading = () => {
    return(
        <div className='h-screen flex justify-center items-center bg-white w-full'>
            <Spin tip="Loading" size="large">
                {content}
            </Spin>
        </div>
    );
};

export default MasterLoading;
