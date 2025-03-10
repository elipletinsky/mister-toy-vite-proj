

export function ActivityList({ activities,backgroundColor, txtColor }) {
    console.log("activities",activities)

    function timeAgo(at) {
        console.log("at",at)
        const now = Date.now();
        const diffMs = now - at;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
        if (diffMinutes < 60) {
            return `${diffMinutes} of minutes ago`
        } else if (diffHours < 24) {
            return `${diffHours} of hours ago`
        } else {
            return `${diffDays} of days ago`
        }
    }

    return (
        <ul className="toy-list">
            
            {activities != null ?( activities.map(activity =>
                <li style={{ backgroundColor: backgroundColor, txtColor: txtColor}}key={activity.txt}>
                    <section className="activity">
                        <p> {activity.txt} </p>
                        <p> {timeAgo(activity.at)} </p>
                        
                    </section>
                </li>
            )) :(
                <div>Activity List Empty</div>
            )}
        </ul>
    )
}