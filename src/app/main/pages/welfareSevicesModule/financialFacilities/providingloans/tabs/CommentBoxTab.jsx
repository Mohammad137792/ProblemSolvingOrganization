import CommentBox from 'app/main/components/CommentBox'
import React from 'react'
import useListState from 'app/main/reducers/listState';

export default function CommentBoxTab() {
    const comments = useListState("id",[])

    return (
        <>
            <CommentBox context={comments}/>
        </>
    )
}
