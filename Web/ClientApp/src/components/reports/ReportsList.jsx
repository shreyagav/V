import React, { Component } from "react";
import { Link } from "react-router-dom";

import MembersUpSVG from "../../svg/MembersUpSVG";
import EventUpSVG from "../../svg/EventUpSVG";
import PaddlerUpSVG from "../../svg/PaddlerUpSVG";
import AttendanceUpSVG from "../../svg/AttendanceUpSVG";

export default class ReportsList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="inner-pages-wrapper ipw-1000">
        <h1 className="uppercase-text">
          <strong>Reports</strong>
        </h1>
        <ul className="reports-nav mt-2">
          <li className="pumpkin">
            <Link to="/Report/Members">
              <span>
                <MembersUpSVG />
              </span>
              <span>Members report</span>
            </Link>
          </li>
          <li className="supernova">
            <Link to="/Report/EventsByType">
              <span>
                <EventUpSVG />
              </span>
              <span>Events by Type</span>
            </Link>
          </li>
          <li className="lime">
            <Link to="/Report/VeteransBySite">
              <span>
                <PaddlerUpSVG />
              </span>
              <span>Veterans by Chapter</span>
            </Link>
          </li>
          <li className="java">
            <Link to="/Report/VeteransAttendence">
              <span>
                <AttendanceUpSVG />
              </span>
              <span>Veteran's Attendence</span>
            </Link>
          </li>
          <li className="java">
            <Link to="/Report/VeteransByEventType">
              <span>
                <AttendanceUpSVG />
              </span>
              <span>Veterans By Event Type</span>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
