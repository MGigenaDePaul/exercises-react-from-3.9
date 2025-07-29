const Notification = ({addMessage}) => {
    if (addMessage === null) {
        return null;
    }
    
    const classes = ['message']
    
    if (addMessage.includes('removed'))  classes.push('removed')
    if (addMessage.includes('shorter'))  classes.push('shorter')
    if (!addMessage.includes('removed') && !addMessage.includes('shorter')) {
        classes.push('success')
    }


    return (
        <div>
            <div className={classes.join(' ')}>
                {addMessage}
            </div>
        </div>
    )
}

export default Notification