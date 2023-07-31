import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import style from './RequestBar.module.css';
import FilterReq from '../filterReq/FilterReq';
import InProcessCard from '../../new-comp/InProcessCard/InProcessCard';
import WaitRequestCard from '../waitRequestCard/WaitRequestCard';
import img from '../../icons/filterIcon.png';

export default function RequestBar(props) {
    const [value, setValue] = React.useState('1');
    const [clickTab1, setClickTab1] = React.useState(true);
    const [clickTab2, setClickTab2] = React.useState(false);
    const {
        render,
        setRender,
        openApplications,
        closeApplications,
        setOpenAppFilter,
        openAppFilter,
        closeAppFilter,
        setCloseAppFilter,
    } = props;

    const countAppInStages = () => {
        const subStageTabMap = props.subStageTabMap[0].map(stage => {
            let count = openApplications.filter(app => app.step_name === stage.stepName).length;
            if (count === 0) count = closeApplications.filter(app => app.step_name === stage.stepName).length;
            stage.count = count;
            return stage;
        });
        return subStageTabMap;
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const onClickTab = value => {
        if (value === 1) {
            setClickTab1(true);
            setClickTab2(false);
        } else {
            setClickTab1(false);
            setClickTab2(true);
        }
    };

    function handleChangeTabIcon(event, tab) {
        if (event)
            return <p className={style.CountAlertFilled}>{tab === 1 ? openAppFilter.length : closeAppFilter.length}</p>;
        else
            return (
                <p className={style.CountAlertOutlined}>{tab === 1 ? openAppFilter.length : closeAppFilter.length}</p>
            );
    }

    const tab = tab => {
        return (
            <div>
                {props.subStageTabMap[0].map((stage, index) => {
                    if (stage.tab === tab) {
                        return (
                            <div key={index}>
                                {tab !== 1 ? (
                                    <div className={style.requestBarSubHeader}>ממתינות ל{stage.header}</div>
                                ) : (
                                    <div className={style.requestBarSubHeader}>{stage.header}</div>
                                )}
                                {tab === 1
                                    ? openAppFilter.map((app, index) => {
                                          if (app.step_name === stage.stepName) {
                                              return (
                                                  <WaitRequestCard
                                                      key={index}
                                                      onClickTab={onClickTab}
                                                      subStageTabMap={props.subStageTabMap[0]}
                                                      stage={stage}
                                                      card={app}
                                                      setRender={setRender}
                                                      render={render}
                                                  />
                                              );
                                          }
                                          return null;
                                      })
                                    : closeAppFilter.map((app, index) => {
                                          if (app.step_name === stage.stepName) {
                                              return (
                                                  <InProcessCard
                                                      key={index}
                                                      stage={stage}
                                                      card={app}
                                                      setRender={setRender}
                                                  />
                                              );
                                          }
                                          return null;
                                      })}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    function filterByTypeReq(typeReq) {
        const step_name = props.subStageTabMap[0].filter(item => typeReq.includes(item.header));
        setOpenAppFilter(openApplications.filter(item => step_name.find(obj => obj.stepName === item.step_name)));
        setCloseAppFilter(closeApplications.filter(item => step_name.find(obj => obj.stepName === item.step_name)));
    }

    return (
        <Box sx={{ width: '90%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box className={style.tabContext} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        textColor="inherit"
                        className={style.tabList}
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                    >
                        <Tab
                            className={style.tab}
                            label="בקשות שממתינות לטיפולך"
                            onClick={() => onClickTab(1)}
                            icon={handleChangeTabIcon(clickTab1, 1)}
                            value="1"
                        />
                        <Tab
                            className={style.tab}
                            label="בקשות נוספות בתהליך"
                            onClick={() => onClickTab(2)}
                            icon={handleChangeTabIcon(clickTab2, 2)}
                            value="2"
                        />
                    </TabList>
                    <div className={style.tabFilterReq}>
                        <FilterReq
                            filterBy={'סנן לפי סטטוס בקשה'}
                            subStageTabMap={countAppInStages}
                            filterByTypeReq={filterByTypeReq}
                            flag={false}
                            stages={props.subStageTabMap[0].map(stage => stage.header)}
                            type={'סנן בקשות'}
                            iconClose={<img className={style.searchIcon} src={img} alt={'סגור'} />}
                            iconOpen={<img className={style.searchIcon} src={img} alt={'פתוח'} />}
                        />
                    </div>
                    <div className={style.bottomLine}></div>
                </Box>
                <TabPanel className={style.tabPanel} value="1">
                    {tab(1)}
                </TabPanel>
                <TabPanel className={style.tabPanel} value="2">
                    {tab(2)}
                </TabPanel>
            </TabContext>
        </Box>
    );
}
