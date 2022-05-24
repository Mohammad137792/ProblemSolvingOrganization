const config = {
    title: 'شماره یک - عمودی',
    defaults: {
        mode: 'fullwidth',
        scroll: 'content',
        navbar: {
            display: true,
            folded: false,
            position: 'left'
        },
        toolbar: {
            display: true,
            style: 'fixed',
            position: 'below'
        },
        footer: {
            display: true,
            style: 'static',
            position: 'below'
        },
        leftSidePanel: {
            display: true
        },
        rightSidePanel: {
            display: true
        }
    },
    form: {
        mode: {
            title: 'نوع',
            type: 'radio',
            options: [
                {
                    name: 'جعبه‌ای',
                    value: 'boxed'
                },
                {
                    name: 'تمام صفحه',
                    value: 'fullwidth'
                }
            ]
        },
        scroll: {
            title: 'محدوده‌ی قابل اسکرول',
            type: 'radio',
            options: [
                {
                    name: 'بدنه',
                    value: 'body'
                },
                {
                    name: 'محتوا',
                    value: 'content'
                }
            ]
        },
        navbar: {
            type: 'group',
            title: 'منو',
            children: {
                display: {
                    title: 'نمایش',
                    type: 'switch'
                },
                folded: {
                    title: 'حالت جمع',
                    type: 'switch'
                },
                position: {
                    title: 'محل قرار گیری',
                    type: 'radio',
                    options: [
                        {
                            name: 'سمت راست',
                            value: 'left'
                        },
                        {
                            name: 'سمت چپ',
                            value: 'right'
                        }
                    ]
                }
            }
        },
        toolbar: {
            type: 'group',
            title: 'نوار ابزار',
            children: {
                display: {
                    title: 'نمایش',
                    type: 'switch'
                },
                style: {
                    title: 'نوع نمایش',
                    type: 'radio',
                    options: [
                        {
                            name: 'ثابت',
                            value: 'fixed'
                        },
                        {
                            name: 'ساکن در صفحه',
                            value: 'static'
                        }
                    ]
                },
                position: {
                    title: 'محل قرارگیری',
                    type: 'radio',
                    options: [
                        {
                            name: 'بالا',
                            value: 'above'
                        },
                        {
                            name: 'پایین',
                            value: 'below'
                        }
                    ]
                }
            }
        },
        footer: {
            type: 'group',
            title: 'پاورقی',
            children: {
                display: {
                    title: 'نمایش',
                    type: 'switch'
                },
                style: {
                    title: 'نوع نمایش',
                    type: 'radio',
                    options: [
                        {
                            name: 'ثابت',
                            value: 'fixed'
                        },
                        {
                            name: 'ساکن در صفحه',
                            value: 'static'
                        }
                    ]
                },
                position: {
                    title: 'محل قرارگیری',
                    type: 'radio',
                    options: [
                        {
                            name: 'بالا',
                            value: 'above'
                        },
                        {
                            name: 'پایین',
                            value: 'below'
                        }
                    ]
                }
            }
        }
    }
};

export default config;
