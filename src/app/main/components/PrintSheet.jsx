import React from "react";
import {makeStyles} from "@material-ui/core/styles";

export default function PrintSheet({children, header, footer, footerHeight="1.5cm", headerHeight="1.5cm", classes={}}) {
    const cx = require('classnames');
    const useStyles = makeStyles((theme) => ({
        pageHeaderSpace: {
            '@media print': {
                height: headerHeight,
            }        },
        pageFooterSpace: {
            '@media print': {
                height: footerHeight,
            }
        }
    }));
    const defClasses = useStyles()

    return(
        <div className="print">
            <div className={cx("page-header", defClasses.pageHeaderSpace, classes.header)} >
                {header}
            </div>
            <table className="print-frame">
                <thead>
                    <tr>
                        <td>
                            <div className={defClasses.pageHeaderSpace}/>
                        </td>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        {children}
                    </td>
                </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <div className={defClasses.pageFooterSpace}/>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div className={cx("page-footer", defClasses.pageFooterSpace, classes.footer)}>
                {footer}
            </div>
        </div>
    )
}
