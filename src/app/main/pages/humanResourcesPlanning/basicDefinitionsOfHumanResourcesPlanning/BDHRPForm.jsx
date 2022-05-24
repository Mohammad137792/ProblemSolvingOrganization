import React from "react";
import Card from "@material-ui/core/Card";
import TabPro from "../../../components/TabPro";
import { useDispatch, useSelector } from "react-redux";
import checkPermis from "app/main/components/CheckPermision";
import TemplateDefinition from "./tabs/TemplateDefinition"
import DefineAttractionPath from "./tabs/DefineAttractionPath/DefineAttractionPath"

const BDHRPForm = () => {

    const datas = useSelector(({ fadak }) => fadak);

    let tabsPermision = []

    // if(checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/DefineAttractionPath", datas)){
    //     tabsPermision.push({
    //         label: 'تعریف مسیر جذب',
    //         panel: <DefineAttractionPath/>
    //     })
    // }
    
    // if(checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/indicator", datas)){
        // tabsPermision.push({
        //     label: 'تنظیمات مراحل تایید ورود و خروج',
        //     panel: <div/>
        // })
    // }

    // if(checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/documentation", datas)){
        // tabsPermision.push({
        //     label: 'تعریف فعالیت جذب نیرو',
        //     panel: <div/>
        // })
    // }

    if(checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/templateDefinition", datas)){
        tabsPermision.push({
            label: 'تعریف الگو متنی',
            panel: <TemplateDefinition />
        })
    }

    // if(checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/documentation", datas)){
        // tabsPermision.push({
        //     label: 'تعریف وظایف جامعه پذیری و خروج',
        //     panel: <div/>
        // })
    // }

    return (
        <Card>
            <TabPro tabs={tabsPermision} />
        </Card>
    );
};

export default BDHRPForm;