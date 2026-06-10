import React from 'react';
import Badge from '../ui/Badge';

const StatusBadge = ({ status }) => {
    const map = {
        pending: "warning", paid: "info", processing: "info",
        shipped: "accent", delivered: "success", cancelled: "danger", refunded: "gray",
        unpaid: "danger", approved: "success",
    };

    return (
        <Badge color = {map[status] || "gray"}>
            {status}
        </Badge>
    )
}

export default StatusBadge;