import React from 'react';
import List from "@material-ui/core/List";
import {Collapse, ListItem, ListItemText} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
function makeParamList(){
    const personal=[{"title":"pseudoId","description":"کد پرسنلی" ,"formula": "PersonnelCode "},
        {"title":"Gender","description":"جنسیت" ,"formula":"gender "},
        {"title":"BirthDate","description":"تاریخ تولد" ,"formula":"BirthDate "},
        {"title":"Age","description":"سن" ,"formula":"Age "},
        {"title":"Nationality","description":"ملیت" ,"formula":"Nationality "},
        {"title":"ProvinceOfIssued","description":"محل صدور" ,"formula":"ProvinceOfIssued "},
        {"title":"Religion","description":"دین" ,"formula":"Religion "},
        {"title":"Sect","description":"مذهب" ,"formula":"Sect "},
        {"title":"ResidenceStatus","description":"وضعیت اسکان" ,"formula":"ResidenceStatus "},
        {"title":"MaritalStatus","description":"وضعیت تاهل" ,"formula":"MaritalStatus "},
        {"title":"CriminalRecord","description":"سابقه کیفری" ,"formula":"CriminalRecord "},
        {"title":"MilitaryState","description":"وضعیت نظام وظیفه" ,"formula":"MilitaryState "},
        {"title":"nationalId","description":"کد ملی","formula":"NationalCode "},
        {"title":"sacrificeType","description":"نوع ایثارگری","formula":"sacrificeType "},
        {"title":"sacrificeDuration","description":"مدت زمان ایثارگری","formula":"sacrificeDuration "},
        {"title":"SacrificePercentage","description":"درصد جانبازی","formula":"SacrificePercentage "},
        {"title":"IsSmoker","description":"فرد سیگاری","formula":"IsSmoker "},
        {"title":"NumberOfKids","description":"تعداد فرزندان","formula":"NumberOfKids "},
        // {"title":"NumberOfKidsBenefit","description":"تعداد فرزندان مشمول حق اولاد","formula":"NumberOfKidsBenefit "},
        // {"title":"InsuranceCoveragePeople","description":"تعداد افراد تحت پوشش بیمه","formula":"InsuranceCoveragePeople "},
        {"title":"SupportedPeople","description":"تعداد افراد تحت تکفل","formula":"SupportedPeople "},
        {"title":"MarriageDate","description":"تاریخ ازدواج","formula":"MarriageDate ","active":false},
        
        {"title":"ProvincePostalHome","description":"استان محل سکونت","formula":"ProvincePostalHome ","active":false},
        {"title":"countyPostalHome","description":"شهرستان محل سکونت","formula":"countyPostalHome ","active":false},
        {"title":"HistoricalDisease","description":"درای سابقه بیماری","formula":"HistoricalDisease ","active":false}]
        const personnelRecoeds = [
            {"title":"Relation","description":"نسبت","formula":"Relation ","active":false},
            {"title":"EmploymentStatusFa","description":"وضعیت اشتغال","formula":"EmploymentStatusFa" ,"active":false},
            {"title":"BirthDateFa","description":"تاریخ تولد خانواده","formula":"BirthDateFa ","active":false},
            {"title":"AgeFa","description":"سن خانواده","formula":"AgeFa ","active":false},
            {"title":"MaritalStatusFa","description":"وضعیت تاهل خانواده","formula":"MaritalStatusFa ","active":false},
            {"title":"LastDegreeFa","description":"آخرین مقطع تحصیلی خانواده","formula":"LastDegreeFa ","active":false},
            {"title":"FieldFa","description":"رشته تحصیلی خانواده","formula":"FieldFa ","active":false},
            {"title":"GenderFa","description":"جنسیت خانواده","formula":"GenderFa ","active":false},
            {"title":"ProvinceOfIssuedFa","description":"استان محل صدور شناسنامه خانواده","formula":"ProvinceOfIssuedFa ","active":false},
            {"title":"NationalityFa","description":"ملیت خانواده","formula":"NationalityFa ","active":false},
            {"title":"ReligionFa","description":"دین خانواده","formula":"ReligionFa ","active":false},
            {"title":"SectFa","description":"مذهب خانواده","formula":"SectFa ","active":false},
            {"title":"NumberOfKidFa","description":"تعداد فرزندان خانواده","formula":"NumberOfKidFa ","active":false},
        ]
    const employment=[
       
        {"title":"PersonnelGroup","description":"گروه پرسنلی" ,"formula":"PersonnelGroup "},
        {"title":"PersonnelSubGroup","description":"زیرگروه پرسنلی" ,"formula":"PersonnelSubGroup "},
        {"title":"ActivityArea","description":"منطقه فعالیت" ,"formula":"ActivityArea "},
        {"title":"ExpertiseArea","description":"حوزه کاری" ,"formula":"ExpertiseArea "},
        {"title":"CostCenter","description":"مرکز هزینه" ,"formula":"CostCenter "},
        {"title":"OrganizationUnitMP","description":"واحد سازمانی پست اصلی" ,"formula":"OrganizationUnitMP "},
        {"title":"positionTitleMP","description":"عنوان پست اصلی" ,"formula":"positionTitleMP "},
        {"title":"OccupancyRateMP","description":"درصد اشتغال در پست اصلی" ,"formula":"OccupancyRateMP "},
        {"title":"NumberOfPosition","description":"تعداد پست های همزمان" ,"formula":"NumberOfPosition "},
        {"title":"JobMP","description":"شغل پست اصلی" ,"formula":"JobMP "},
        {"title":"JobGradeTitleMP","description":"عنوان طبقه شغلی پست اصلی" ,"formula":"JobGradeTitleMP "},
        {"title":"JobGradeMP","description":"طبقه شغلی پست اصلی" ,"formula":"JobGradeMP "},
        {"title":"JobRankMP","description":"رتبه شغلی پست اصلی" ,"formula":"JobRankMP "},
        {"title":"positionTypeMP","description":"نوع پست اصلی" ,"formula":"positionTypeMP "},
        {"title":"GradeTypeMP","description":"رده سازمانی پست اصلی" ,"formula":"GradeTypeMP "},
       ]
       const employmentRecords = [
        {"title":"OrganizationUnit","description":"واحد سازمانی" ,"formula":"OrganizationUnit ","active":false},
        {"title":"MainPosition","description":"پست اصلی" ,"formula":"MainPosition ","active":false},
        {"title":"OccupancyRate","description":"درصد اشتغال" ,"formula":"OccupancyRate ","active":false},
        {"title":"Job","description":"شغل پست" ,"formula":"Job ","active":false},
        {"title":"JobGradeTitle","description":"عنوان طبقه شغلی" ,"formula":"JobGradeTitle ","active":false},
        {"title":"JobGrade","description":"طبقه شغلی" ,"formula":"JobGrade ","active":false},
        {"title":"JobRank","description":"رتبه شغلی" ,"formula":"JobRank ","active":false},
        {"title":"PositionType","description":"نوع پست" ,"formula":"PositionType ","active":false},
        {"title":"GradeType","description":"رده سازمانی پست" ,"formula":"GradeType ","active":false},
       ]
    const jobRecords=[
        {"title":"JobWEx","description":"شغل سابقه شغلی" ,"formula":"JobWEx ","active":false},
        {"title":"JobWExRelation","description":"ارتباط سابقه شغلی" ,"formula":"JobWExRelation ","active":false},
        {"title":"GradeTypeWex","description":"رده سازمانی سابقه شغلی" ,"formula":"GradeTypeWex ","active":false},
        {"title":"FromDateWEx","description":"تاریخ شروع سابقه شغلی" ,"formula":"FromDateWEx ","active":false},
        {"title":"ThruDateWEx","description":"تاریخ پایان سابقه شغلی" ,"formula":"ThruDateWEx ","active":false},
        {"title":"WorkweekWEx","description":"ساعات کاری در هفته سابقه شغلی" ,"formula":"WorkweekWEx ","active":false},
        {"title":"ProvinceWEx","description":"استان سابقه شغلی" ,"formula":"ProvinceWEx ","active":false}]

    const job = [
        {"title":"WorkExperience","description":"میزان سابقه شغلی" ,"formula":"WorkExperience "},
        {"title":"RelatedWorkExperience","description":"میزان سابقه کار مرتبط" ,"formula":"RelatedWorkExperience "},
        {"title":"SemiRelatedWorkExperience","description":"میزان سابقه کار نیمه مرتبط" ,"formula":"SemiRelatedWorkExperience "},
        {"title":"NonRelatedWorkExperience","description":"میزان سابقه کار غیر مرتبط" ,"formula":"NonRelatedWorkExperience "},

    ]
    const education=[{"title":"LastDegree","description":"آخرین مقطع تحصیلی","formula":"LastDegree "},
        {"title":"UniversityTypeLastDegree","description":"نوع دانشگاه آخرین مقطع تحصیلی","formula":"UniversityTypeLastDegree "},
        {"title":"GradeLastDegree","description":"معدل آخرین مقطع تحصیلی","formula":"GradeLastDegree "},
        {"title":"FieldLastDegree","description":"رشته تحصیلی آخرین مقطع تحصیلی","formula":"FieldLastDegree "},
        {"title":"DepartmentLastDegree","description":"گروه آموزشی آخرین مقطع تحصیلی","formula":"DepartmentLastDegree "},
        {"title":"RelationLastDegree","description":"سطح ارتباط آخرین مقطع تحصیلی","formula":"RelationLastDegree "},
       ]
    const educationRecords = [
        {"title":"Degree","description":" مقطع ","formula":"Degree ","active":false},
        {"title":"Field","description":"رشته تحصیلی","formula":"Field ","active":false},
        {"title":"StartDateDegree","description":"تاریخ شروع تحصیل","formula":"StartDateDegree ","active":false},
        {"title":"EndDateDegree","description":"تاریخ پایان تحصیل","formula":"EndDateDegree ","active":false},
        {"title":"GradeDegree","description":"معدل","formula":"GradeDegree ","active":false},
        {"title":"DepartmentDegree","description":"گروه آموزشی","formula":"DepartmentDegree ","active":false},
        {"title":"UniversityTypeDegree","description":"نوع دانشگاه","formula":"UniversityTypeDegree ","active":false},
        {"title":"CountryDegree","description":"کشور مقطع تحصیلی","formula":"CountryDegree ","active":false},
        {"title":"relationDegree","description":"ارتباط مقطع تحصیلی","formula":"relationDegree","active":false},

    ]
    const emplOrder=[{"title":"PreOrderAmount","description":"مقدار حکم کارگزینی قبلی","formula":"PreOrderAmount "},
        {"title":"PreOrderType","description":"نوع حکم کارگزینی قبلی","formula":"PreOrderType ","active":false},
        {"title":"PreOrderPosition","description":"پست سازمانی حکم قبلی","formula":"PreOrderPosition ","active":false},
        {"title":"PreOrderOrgnUnit","description":"واحد سازمانی حکم قبلی","formula":"PreOrderOrgnUnit ","active":false},
        {"title":"PreOrderOrgnLevel","description":"رده سازمانی حکم قبلی","formula":"PreOrderOrgnLevel ","active":false},
        {"title":"PreOrderJob","description":"شغل حکم قبلی","formula":"PreOrderJob ","active":false},
        {"title":"PreOrderJobRank","description":"رتبه شغلی حکم قبلی","formula":"PreOrderJobRank ","active":false},
        {"title":"PreOrderJobGrad","description":"طبقه شغلی حکم قبلی","formula":"PreOrderJobGrad ","active":false},
        {"title":"PreOrderPersonnelGruop","description":"گروه پرسنلی حکم قبلی","formula":"PreOrderPersonnelGruop ","active":false},
        {"title":"PreOrderPersonnelSubGruop","description":"زیرگروه پرسنلی حکم قبلی","formula":"PreOrderPersonnelSubGruop ","active":false},
        {"title":"PreOrderActivityArea","description":"منطقه فعالیت حکم قبلی","formula":"PreOrderActivityArea ","active":false},
        {"title":"PreOrderExpertiseArea","description":"حوزه کاری حکم قبلی","formula":"PreOrderExpertiseArea ","active":false},
        {"title":"PreOrderCostCenter","description":"مرکز هزینه حکم قبلی","formula":"PreOrderCostCenter ","active":false},
        {"title":"PreOrderAgreementType","description":"نوع قرارداد حکم قبلی","formula":"PreOrderAgreementType ","active":false},
        {"title":"PreOrderCode","description":"شماره حکم قبلی","formula":"PreOrderCode ","active":false},
        {"title":"PreOrderIssueDate","description":"تاریخ صدور حکم قبلی","formula":"PreOrderIssueDate ","active":false},
        {"title":"PreOrderFromDate","description":"تاریخ اجرای حکم قبلی","formula":"PreOrderFromDate ","active":false},
        {"title":"PreOrderThruDate","description":"تاریخ پایان اعتبار حکم قبلی","formula":"PreOrderThruDate ","active":false},
        {"title":"PreOrderStatus","description":"وضعیت حکم قبلی","formula":"PreOrderStatus "},
      
        {"title":"PreAgreementCode","description":"شماره آخرین قرارداد","formula":"PreAgreementCode ","active":false},
        {"title":"EmploymentDate","description":"تاریخ استخدام","formula":"EmploymentDate "},
        {"title":"PreAgreementDate","description":"تاریخ عقد آخرین قرارداد ","formula":"PreAgreementDate ","active":false},
        {"title":"PreAgreementFromDate","description":"تاریخ شروع آخرین قرارداد","formula":"PreAgreementFromDate ","active":false},
        {"title":"PreAgreementThruDate","description":"تاریخ پایان آخرین قرارداد","formula":"PreAgreementThruDate ","active":false},
        {"title":"PreAgreementStatus","description":"وضعیت آخرین قرارداد","formula":"PreAgreementStatus ","active":false}]
        const emplOrderRecords = [
            {"title":"OrderAmount","description":"مقدار حکم","formula":"OrderAmount ","active":false},
            {"title":"OrderType","description":"نوع حکم ","formula":"OrderType ","active":false},
            {"title":"OrderPosition","description":"پست سازمانی حکم","formula":"OrderPosition ","active":false},
            {"title":"OrderOrgnUnit","description":"واحد سازمانی حکم","formula":"OrderOrgnUnit ","active":false},
            {"title":"OrderOrgnLevel","description":"رده سازمانی حکم","formula":"OrderOrgnLevel ","active":false},
            {"title":"OrderJob","description":"شغل حکم","formula":"OrderJob ","active":false},
            {"title":"OrderJobRank","description":"رتبه شغلی حکم","formula":"OrderJobRank ","active":false},
            {"title":"OrderJobGrad","description":"طبقه شغلی حکم","formula":"OrderJobGrad ","active":false},
            {"title":"OrderPersonnelGruop","description":"گروه پرسنلی حکم","formula":"OrderPersonnelGruop ","active":false},
            {"title":"OrderPersonnelSubGruop","description":"زیرگروه پرسنلی حکم","formula":"OrderPersonnelSubGruop ","active":false},
            {"title":"OrderActivityArea","description":"منطقه فعالیت حکم","formula":"OrderActivityArea ","active":false},
            {"title":"OrderExpertiseArea","description":"حوزه کاری حکم","formula":"OrderExpertiseArea ","active":false},
            {"title":"OrderCostCenter","description":"مرکز هزینه حکم","formula":"OrderCostCenter ","active":false},
            {"title":"OrderAgreementType","description":"شماره حکم","formula":"OrderAgreementType ","active":false},
            {"title":"OrderCode","description":"نوع قرارداد حکم","formula":"OrderCode ","active":false},
            {"title":"OrderIssueDate","description":"تاریخ صدور حکم","formula":"OrderIssueDate ","active":false},
            {"title":"OrderFromDate","description":"تاریخ اجرای حکم","formula":"OrderFromDate ","active":false},
            {"title":"OrderThruDate","description":"تاریخ پایان اعتبار حکم","formula":"OrderThruDate ","active":false},
            {"title":"OrderStatus","description":"وضعیت حکم","formula":"OrderStatus ","active":false},
            {"title":"AgreementDate","description":"تاریخ عقد  قرارداد ","formula":"AgreementDate ","active":false},
            {"title":"AgreementFromDate","description":"تاریخ شروع  قرارداد","formula":"AgreementFromDate ","active":false},
            {"title":"AgreementThruDate","description":"تاریخ پایان  قرارداد","formula":"AgreementThruDate ","active":false},
            {"title":"AgreementStatus","description":"وضعیت قرارداد","formula":"AgreementStatus ","active":false},
            {"title":"AgreementCode","description":"شماره قرارداد","formula":"AgreementCode ","active":false}
        ]
    const ParamList=[{"title":"general","description":"اطلاعات شخصی" ,"members":personal},
    {"title":"generalRecords","description":"رکورد های اطلاعات خانواده" ,"members":personnelRecoeds},
        {"title":"employment","description":"اطلاعات سازمانی" ,"members":employment},
        {"title":"employmentRecords","description":"رکورد های اطلاعات سازمانی" ,"members":employmentRecords},
        {"title":"job","description":"سوابق شغلی" ,"members":job},
        {"title":"jobRecords","description":"رکوردهای سوابق شغلی" ,"members":jobRecords},
        {"title":"education","description":"سوابق تحصیلی" ,"members":education},
        {"title":"educationRecords","description":"رکوردهای سوابق تحصیلی" ,"members":educationRecords},
        {"title":"emplOrder","description":"حکم کارگزینی" ,"members":emplOrder},
        {"title":"emplOrderRecords","description":"رکوردهای حکم کارگزینی" ,"members":emplOrderRecords},
    ]
    return ParamList;
}
class Param extends React.Component {

    
    state = {};
    handleClick = e => {
        this.setState({ [e]: !this.state[e] });
    };
    render() {

        const params=makeParamList();

        const DisableRow = {
                    zIndex:'9999',
                    position: 'absolute',
                    top:'0',
                    display:'block',
                    width: '100%',
                    height: '100%',
                    background:'#ffffff74'

        }
        return (
            <>
                <List>
                    {params?.map((ele)=>{
                        return(
                            <>
                                <ListItem button  onClick={this.handleClick.bind(
                                    this,
                                    ele.title
                                )}>
                                    <ListItemText primary={ele.description}/>
                                    {this.state[ele.title] ? (
                                        <ExpandLess/>
                                    ) : (
                                        <ExpandMore/>
                                    )}
                                    <Divider absolute/>
                                </ListItem>
                                <Collapse
                                    component="li"
                                    in={this.state[ele.title]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    {ele.members.map((entry)=>{
                                        return(
                                            <List onClick={(e)=>{entry.active !== false ? this.props.changeFormula(entry.formula) : e.preventDefault()}}>
                                                <ListItem button>
                                                    <ListItemText primary={entry.description}/>
                                                </ListItem>
                                                {
                                                    entry.active !== false ? '' : <span style={DisableRow}></span>
                                                }
                                            </List>
                                        )
                                    })}
                                </Collapse>
                            </>
                        )})}
                </List>
            </>
        )
    }
}
export default Param;