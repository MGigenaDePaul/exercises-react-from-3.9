const Notification = ({addMessage}) => {
    if (addMessage === null) {
        return null;
    }
    
    const className = addMessage.includes('removed') ? 'message removed' : 'message success'
    
    return (
        <div>
            <div className={className}>
                {addMessage}
            </div>
        </div>
    )
}

export default Notification