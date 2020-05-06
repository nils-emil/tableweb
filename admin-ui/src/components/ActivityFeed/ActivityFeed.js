import React, { useEffect, useState } from 'react'
import './styles.scss'
import io from 'socket.io-client'
import Feed from '../FeedWithHeader/Feed'
import { connect } from 'react-redux/es/alternate-renderers'
import { fetchAll } from '../../services/orderService'
import FeedSelector from '../FeedSelector/FeedSelector'
import {
  EMIT_FETCH_ALL_ORDERS,
  EMIT_FETCH_SERVICE_CALLS,
  EMIT_ORDER_SERVICED,
  EMIT_SERVICE_CALL_SERVICED,
  RECEIVE_ALL_ORDERS,
  RECEIVE_ALL_SERVICE_CALLS,
  RECEIVE_REFRESH_ORDERS,
  RECEIVE_SERVICE_CALLED
} from './socketConstants'

const socket = io(process.env.REACT_APP_BACKEND_URL)

function ActivityFeed(props) {

  const { organizationId } = props.auth.user

  const [serviceCalls, setServiceCalls] = useState([])
  const [isServiceCallSelected, selectServiceCalls] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    socket.on(RECEIVE_ALL_SERVICE_CALLS, (data) => {
      setServiceCalls(data.map(call => transformServiceCall(call)))
    })

    socket.emit(EMIT_FETCH_SERVICE_CALLS)

    return () => {
      socket.off(RECEIVE_ALL_SERVICE_CALLS)
    }
  }, [])


  useEffect(() => {
    socket.on(RECEIVE_SERVICE_CALLED, function (data) {
      setServiceCalls([transformServiceCall(data), ...serviceCalls])
    })

    return () => {
      socket.off(RECEIVE_SERVICE_CALLED)
    }
  })

  useEffect(() => {
    socket.on(RECEIVE_ALL_ORDERS, (data) => {
      setOrders(data.map(order => transformOrder(order)))
    })

    socket.emit(EMIT_FETCH_ALL_ORDERS, { organizationId })

    return () => {
      socket.off(RECEIVE_ALL_ORDERS)
    }
  }, [])


  useEffect(() => {
    socket.on(RECEIVE_REFRESH_ORDERS + organizationId, function () {
      fetchAll().subscribe(response => {
        setOrders(response.data.map(order => transformOrder(order)))
      })
    })

    return () => {
      socket.off(RECEIVE_REFRESH_ORDERS + organizationId)
    }
  })

  const transformServiceCall = (call) => {
    return {
      _id: call._id,
      message: `Laud ${call.tableCode} tellis ${call.callType === 'PAYMENT' ? 'kaardimakse' : 'teeninduse'}`,
      isWaiting: call.isWaiting,
      callTime: call.callTime
    }
  }

  const transformOrder = (order) => {
    return {
      _id: order._id,
      message: `Laud ${order.tableCode} tellis süüa`,
      isWaiting: order.isWaiting,
      callTime: order.callTime
    }
  }

  const toggleServiceCallWaiting = (call) => {
    let callsCopy = [...serviceCalls]
    callsCopy.forEach(originalCall => {
        if (originalCall === call) {
          originalCall.isWaiting = !call.isWaiting
        }
      }
    )

    setServiceCalls(callsCopy)
    socket.emit(EMIT_SERVICE_CALL_SERVICED, {
      _id: call._id
    })
  }

  const toggleOrderWaiting = (order) => {
    let ordersCopy = [...orders]
    ordersCopy.forEach(originalOrder => {
        if (originalOrder === order) {
          originalOrder.isWaiting = !order.isWaiting
        }
      }
    )

    setOrders(ordersCopy)
    socket.emit(EMIT_ORDER_SERVICED, {
      _id: order._id
    })
  }

  return (
    <div className="activity-feed">
      <div>
        <FeedSelector isServiceCallSelected={isServiceCallSelected}
                      selectServiceCalls={() => selectServiceCalls(true)}
                      isServiceRequiringCallAttention={serviceCalls.some(call => {
                        return call.isWaiting
                      })}
                      selectOrders={() => selectServiceCalls(false)}
                      isOrderRequiringAttention={orders.some(order => {
                        return order.isWaiting
                      })}
        />
      </div>
      <Feed serviceCalls={isServiceCallSelected ? serviceCalls : orders}
            onClick={isServiceCallSelected ? toggleServiceCallWaiting : toggleOrderWaiting}
      />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}
export default connect(mapStateToProps, null)(ActivityFeed)