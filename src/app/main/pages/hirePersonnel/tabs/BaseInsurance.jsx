import React from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader, Chip,
    FormControl, FormControlLabel,
    Grid,
    InputLabel,
    MenuItem, Select, Switch,
    TextField
} from "@material-ui/core";

import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import MultipleSelect from "../../../components/MultipleSelect";
import Paper from '@material-ui/core/Paper';
import Autocomplete from "@material-ui/lab/Autocomplete";
import SimpleModal from "./SimpleModal";
import SimpleModal1 from "./SimpleModal1";
import {setFormDataHelper} from "../../../helpers/setFormDataHelper";
import { Checkbox } from '@material-ui/core';
import CheckBoxIcon from "@material-ui/icons/CheckBox";


// import Datepicker from 'rezvani-datepicker';
import {INPUT_TYPES} from "../../../helpers/setFormDataHelper";
import DatePicker from "../../../components/DatePicker";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function valuetext(value) {
    return `${value}`;
}

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 325,
    },
    dis:{
        fontSize:8
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 320,
    },
    root: {
        padding: theme.spacing(3, 2),
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: '100%',
        flexGrow: 1
    },
    submitButton: {
        marginTop: theme.spacing(2)
    },
    dropdown: {
        position: 'fixed',
        width: 200,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid',
    },
}));

function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
const BaseInsurance = ({formValues, addFormValue,handleChanges}) => {


    const classes = useStyles();

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedDateaz, setSelectedDateaz] = React.useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleDateChangeaz = (date) => {
        setSelectedDateaz(date);
    };

    const [open1, setOpen1] = React.useState(true);

    const handleClickopenFilter = () => handleChanges(false);

    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const [formState, setFormState] = React.useState({
        userRoles: []
    });
    const [value, setValue] = React.useState([0, 10]);
    const [selectedFilm, setSelectedFilm] = React.useState([]);

    // const [selectVal, setSelectVal] = React.useState([]);
    // const [selectValvahedsazmani, setSelectValvahedsazmani] = React.useState([]);
    // const [selectValgorohpersoneli, setSelectValgorohpersoneli] = React.useState([]);
    // const [selectValzirgorohpersoneli, setSelectValzirgorohpersoneli] = React.useState([]);
    // const [selectValfaliat, setSelectValfaliat] = React.useState([]);
    // const [selectValhozekari, setSelectValhozekari] = React.useState([]);
    // const [selectValmarkazhazine, setSelectValmarkazhazine] = React.useState([]);

    const handleKeyDown = event => {
        switch (event.key) {
            case " ": {
                event.preventDefault();
                event.stopPropagation();
                if (event.target.value.length > 0) {
                    setValue([...value, event.target.value]);
                }
                break;
            }
            default:
        }
    };

    // const [no, setno] = React.useState('');
    // const handleno = (event) => {
    //     setno(event.target.value);
    // };
    //
    // const handleChangedate = (event) => {
    //     const newState = {};
    //     newState[event.target.name] = event.target.value;
    //     this.setState(newState);
    // };

    return (
        <>
            {open1 &&
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                multiple
                                id="tags"
                                options={top100Films}
                                disableCloseOnSelect
                                onChange={(e, film) => {
                                    setSelectedFilm(film);
                                }}
                                getOptionLabel={option => option.title}
                                renderOption={(option, state) => {
                                    const selectFilmIndex = selectedFilm.findIndex(
                                        film => film.title.toLowerCase() === "all"
                                    );
                                    if (selectFilmIndex > -1) {
                                        state.selected = true;
                                    }
                                    return (
                                        <React.Fragment>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={state.selected}
                                            />
                                            {option.title}
                                        </React.Fragment>
                                    );
                                }}
                                style={{ width: 335 , marginTop: 15}}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="مهارتها"
                                        placeholder="Favorites"
                                    />
                                )}
                            />
                            {/*<Autocomplete*/}
                            {/*    multiple*/}
                            {/*    // freeSolo*/}
                            {/*    id="tags"*/}
                            {/*    options={top100Films}*/}
                            {/*    getOptionLabel={option => option.title || option}*/}
                            {/*    value={formValues.tags ?? []}*/}
                            {/*    onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.AUTO_COMPLETE, "tags")}*/}
                            {/*    مهارت*/}
                            {/*    renderInput={params => {*/}
                            {/*        params.inputProps.onKeyDown = handleKeyDown;*/}
                            {/*        return (*/}
                            {/*            <TextField*/}
                            {/*                {...params}*/}
                            {/*                variant="outlined"*/}
                            {/*                label="مهارت"*/}
                            {/*                margin="normal"*/}
                            {/*                fullWidth*/}
                            {/*            />*/}
                            {/*        );*/}
                            {/*    }}*/}
                            {/*/>*/}

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={classes.dis} gutterBottom>
                                از تاریخ                           </Typography>
                            {/*<DatePicker withTime variant="outlined" id="baseInfoBirthDate"*/}
                            {/*            value={formValues.baseInfoBirthDate ?? new Date()}*/}
                            {/*            setValue={setFormDataHelper(addFormValue)(INPUT_TYPES.PICKER, "baseInfoBirthDate")}*/}
                            {/*            format={"jYYYY/jMMMM/jDD hh:mm"}*/}
                            {/*            label=" " fullWidth/>*/}
                            <TextField variant="outlined"
                                id="baseInfoBirthDate"
                                type="datetime-local"
                                defaultValue="2017-05-24T10:30"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Grid>
                        {/*<Grid item xs={12} md={4}>*/}
                        {/*    <FormControl>*/}
                        {/*        <FormControlLabel*/}
                        {/*            control={<Switch checked={formValues.hasPersonnelDiseaseBackground === true}*/}
                        {/*                             onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.CHECKBOX)}*/}
                        {/*                             name="hasPersonnelDiseaseBackground"/>}*/}
                        {/*            label="فرد دارای سابقه بیماری است"/>*/}
                        {/*    </FormControl>*/}
                        {/*</Grid>*/}

                        <Grid item xs={12} md={4}>
                            <Typography className={classes.dis} gutterBottom>
                                تا تاریخ                            </Typography>
                            <TextField variant="outlined"
                                       id="baseInfoBirthDate1"
                                       type="datetime-local"
                                       defaultValue="2017-05-24T10:30"
                                       className={classes.textField}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />
                            {/*<DatePicker withTime variant="outlined" id="baseInfoBirthDate1"*/}
                            {/*            value={formValues.baseInfoBirthDate1 ?? new Date()}*/}
                            {/*            setValue={setFormDataHelper(addFormValue)(INPUT_TYPES.PICKER, "baseInfoBirthDate1")}*/}
                            {/*            format={"jYYYY/jMMMM/jDD hh:mm"}*/}
                            {/*            label=" " fullWidth/>*/}
                        </Grid>

                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="baseidsherkat" label="شرکت " value={formValues.baseidsherkat} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value="3">3 </MenuItem>
                                <MenuItem value="3">3 </MenuItem>
                                <MenuItem value="3">3 </MenuItem>
                            </MultipleSelect>

                        </Grid>
                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="vahedsazmani" label=" واحد سازمانی" value={formValues.vahedsazmani} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value="3 ">3 </MenuItem>
                                <MenuItem value="3 ">3 </MenuItem>
                                <MenuItem value="3 ">3 </MenuItem>
                            </MultipleSelect>

                        </Grid>
                        <Grid item xs={12} md={4}>

                            <TextField select variant="outlined" id="idno"
                                       label="نوع " onChange={addFormValue} value={formValues.idno} fullWidth>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                            </TextField>

                            {/*<Select className={classes.formControl}*/}
                            {/*        labelId="demo-simple-select-label"*/}
                            {/*        id="idno"*/}
                            {/*        value={no }*/}
                            {/*        onChange={handleno}*/}
                            {/*>*/}
                            {/*  */}

                            {/*</Select>*/}

                        </Grid>
                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="goropersoneli" label=" گروه پرسنلی" value={formValues.goropersoneli} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value=" 54">54 </MenuItem>
                                <MenuItem value="54 ">54 </MenuItem>
                                <MenuItem value="54 ">54 </MenuItem>
                            </MultipleSelect>

                        </Grid>
                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="zirgropersoneli" label="زیرگروه پرسنلی " value={formValues.zirgropersoneli} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value="34 ">34 </MenuItem>
                                <MenuItem value="34 ">34 </MenuItem>
                                <MenuItem value="34 ">34 </MenuItem>
                            </MultipleSelect>

                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper> </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="mantaghe" label="منطقه فعالیت " value={formValues.mantaghe} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value="34 ">34 </MenuItem>
                                <MenuItem value=" 34">34 </MenuItem>
                                <MenuItem value=" 34">34 </MenuItem>
                            </MultipleSelect>

                        </Grid>
                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="hozekari" label="حوزه کاری  " value={formValues.hozekari} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value="مهندسی صنایع">مهندسی صنایع</MenuItem>
                                <MenuItem value="مهندسی عمران">مهندسی عمران</MenuItem>
                                <MenuItem value="مهندسی شیمی">مهندسی شیمی</MenuItem>
                                <MenuItem value="مدیریت اجرایی">مدیریت اجرایی</MenuItem>
                            </MultipleSelect>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <MultipleSelect id="markazhazine" label="مرکز هزینه   " value={formValues.markazhazine} onChange={setFormDataHelper(addFormValue)(INPUT_TYPES.MULTI_SELECT)}>
                                <MenuItem value=" 43">43 </MenuItem>
                                <MenuItem value=" 43">43 </MenuItem>
                                <MenuItem value=" 43">43 </MenuItem>
                            </MultipleSelect>

                        </Grid>
                        {/*<Grid item xs={12} md={4}>*/}
                        {/*<div>*/}

                        <Grid item xs={12} md={4}>
                            <SimpleModal/>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <SimpleModal1/>
                        </Grid>

                        {/*</div>*/}
                        {/*</Grid>*/}
                        <Grid item xs={12} md={4}>

                            <Button variant="contained" color="primary" size="small" onClick={handleClickopenFilter}>اعمال </Button>

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            }
        </>
    );
}


export default BaseInsurance;

const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    { title: "The Lord of the Rings: The Return of the King", year: 2003 },
    { title: "The Good, the Bad and the Ugly", year: 1966 },
    { title: "Fight Club", year: 1999 },
    { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
    { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
    { title: "Forrest Gump", year: 1994 },
    { title: "Inception", year: 2010 },
    { title: "The Lord of the Rings: The Two Towers", year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: "Goodfellas", year: 1990 },
    { title: "The Matrix", year: 1999 },
    { title: "Seven Samurai", year: 1954 },
    { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
    { title: "City of God", year: 2002 },
    { title: "Se7en", year: 1995 },
    { title: "The Silence of the Lambs", year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: "Life Is Beautiful", year: 1997 },
    { title: "The Usual Suspects", year: 1995 },
    { title: "Léon: The Professional", year: 1994 },
    { title: "Spirited Away", year: 2001 },
    { title: "Saving Private Ryan", year: 1998 },
    { title: "Once Upon a Time in the West", year: 1968 },
    { title: "American History X", year: 1998 },
    { title: "Interstellar", year: 2014 },
    { title: "Casablanca", year: 1942 },
    { title: "City Lights", year: 1931 },
    { title: "Psycho", year: 1960 },
    { title: "The Green Mile", year: 1999 },
    { title: "The Intouchables", year: 2011 },
    { title: "Modern Times", year: 1936 },
    { title: "Raiders of the Lost Ark", year: 1981 },
    { title: "Rear Window", year: 1954 },
    { title: "The Pianist", year: 2002 },
    { title: "The Departed", year: 2006 },
    { title: "Terminator 2: Judgment Day", year: 1991 },
    { title: "Back to the Future", year: 1985 },
    { title: "Whiplash", year: 2014 },
    { title: "Gladiator", year: 2000 },
    { title: "Memento", year: 2000 },
    { title: "The Prestige", year: 2006 },
    { title: "The Lion King", year: 1994 },
    { title: "Apocalypse Now", year: 1979 },
    { title: "Alien", year: 1979 },
    { title: "Sunset Boulevard", year: 1950 },
    {
        title:
            "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
        year: 1964
    },
    { title: "The Great Dictator", year: 1940 },
    { title: "Cinema Paradiso", year: 1988 },
    { title: "The Lives of Others", year: 2006 },
    { title: "Grave of the Fireflies", year: 1988 },
    { title: "Paths of Glory", year: 1957 },
    { title: "Django Unchained", year: 2012 },
    { title: "The Shining", year: 1980 },
    { title: "WALL·E", year: 2008 },
    { title: "American Beauty", year: 1999 },
    { title: "The Dark Knight Rises", year: 2012 },
    { title: "Princess Mononoke", year: 1997 },
    { title: "Aliens", year: 1986 },
    { title: "Oldboy", year: 2003 },
    { title: "Once Upon a Time in America", year: 1984 },
    { title: "Witness for the Prosecution", year: 1957 },
    { title: "Das Boot", year: 1981 },
    { title: "Citizen Kane", year: 1941 },
    { title: "North by Northwest", year: 1959 },
    { title: "Vertigo", year: 1958 },
    { title: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
    { title: "Reservoir Dogs", year: 1992 },
    { title: "Braveheart", year: 1995 },
    { title: "M", year: 1931 },
    { title: "Requiem for a Dream", year: 2000 },
    { title: "Amélie", year: 2001 },
    { title: "A Clockwork Orange", year: 1971 },
    { title: "Like Stars on Earth", year: 2007 },
    { title: "Taxi Driver", year: 1976 },
    { title: "Lawrence of Arabia", year: 1962 },
    { title: "Double Indemnity", year: 1944 },
    { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
    { title: "Amadeus", year: 1984 },
    { title: "To Kill a Mockingbird", year: 1962 },
    { title: "Toy Story 3", year: 2010 },
    { title: "Logan", year: 2017 },
    { title: "Full Metal Jacket", year: 1987 },
    { title: "Dangal", year: 2016 },
    { title: "The Sting", year: 1973 },
    { title: "2001: A Space Odyssey", year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: "Toy Story", year: 1995 },
    { title: "Bicycle Thieves", year: 1948 },
    { title: "The Kid", year: 1921 },
    { title: "Inglourious Basterds", year: 2009 },
    { title: "Snatch", year: 2000 },
    { title: "3 Idiots", year: 2009 },
    { title: "Monty Python and the Holy Grail", year: 1975 }
];
