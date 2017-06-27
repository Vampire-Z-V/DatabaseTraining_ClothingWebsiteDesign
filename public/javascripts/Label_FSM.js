var States = {
    "NOT_INSIDE_ITESMS": {
        "NOT_INSIDE_DATAS": "S0_0",
        "HAS_OPTION_INSERT": "S0_1",
        "HAS_OPTION_SAMEITEM": "S0_2"
    },
    "INSIDE_ITEMS": {
        "NOT_INSIDE_DATAS": "S1_0",
        "HAS_OPTION_UPDATE": "S1_1",
        "HAS_OPTION_DELETE": "S1_2",
        "HAS_OPTION_DELETE_SAMEITEM": "S1_3",
        "HAS_OPTION_DELETE_INSERT": "S1_4"
    }
};

function Label_FSM(item_type, isInItems) {
    /**
     * @return {string}
     */
    this.Transaction = function (option) {
        var start_state = curr_state;
        var final_state;
        switch (curr_state) {
            case "S0_0":
                switch (option) {
                    case "insert":
                        curr_state = "S0_1";
                        break;
                    case "sameitem":
                        curr_state = "S0_2";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;
            case "S0_1":
                switch (option) {
                    case "delete":
                        curr_state = "S0_0";
                        break;
                    case "update":
                        curr_state = "S0_1";
                        break;
                    case "sameitem":
                        curr_state = "S0_2";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;
            case "S0_2":
                switch (option) {
                    case "delete":
                        curr_state = "S0_0";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;

            case "S1_0":
                switch (option) {
                    case "update:same":
                        curr_state = "S1_0";
                        break;
                    case "update:different":
                        curr_state = "S1_1";
                        break;
                    case "delete":
                        curr_state = "S1_2";
                        break;
                    case "sameitem":
                        curr_state = "S1_3";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;
            case "S1_1":
                switch (option) {
                    case "update:same":
                        curr_state = "S1_0";
                        break;
                    case "update:different":
                        curr_state = "S1_1";
                        break;
                    case "delete":
                        curr_state = "S1_2";
                        break;
                    case "sameitem":
                        curr_state = "S1_3";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;
            case "S1_2":
                switch (option) {
                    case "insert:same":
                        curr_state = "S1_0";
                        break;
                    case "sameitem":
                        curr_state = "S1_3";
                        break;
                    case "insert:different":
                        curr_state = "S1_4";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;
            case "S1_3":
                switch (option) {
                    case "delete":
                        curr_state = "S1_2";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;
            case "S1_4":
                switch (option) {
                    case "update:same":
                        curr_state = "S1_0";
                        break;
                    case "delete":
                        curr_state = "S1_2";
                        break;
                    case "sameitem":
                        curr_state = "S1_3";
                        break;
                    case "update:different":
                        curr_state = "S1_4";
                        break;
                    default:
                        alert("Can't change " + curr_state + " with option " + option);
                }
                break;

            default:
                alert("There is no this curr_state");
                break;
        }
        final_state = curr_state;
        return TranslateState(start_state, final_state);
    };
    /**
     * @return {boolean}
     */
    this.IsAccept = function () {
        switch (curr_state) {
            case "S0_0":
            case "S1_0":
                return false;
            default:
                return true;
        }
    };
    this.GetType = function () {
        return type;
    };
    /**
     * @return {string}
     */
    this.GetCurr = function () {
        return curr_state;
    }

    var curr_state = InitState(isInItems);
    var type = item_type;

    /**
     * @return {string}
     */
    function InitState(isInItems) {
        if (isInItems) {
            return States.INSIDE_ITEMS.NOT_INSIDE_DATAS;
        }
        else {
            return States.NOT_INSIDE_ITESMS.NOT_INSIDE_DATAS;
        }
    }

    /**
     * @return {string}
     */
    function TranslateState(startState, finalState) {
        var result = "";
        var translate = "->";
        switch (startState) {
            case "S0_1":
                switch (finalState) {
                    case "S0_2":
                        result += startState + translate + "S0_0";
                        result += ",";
                        result += "S0_0" + translate + finalState;
                        break;
                    default:
                        result += startState + translate + finalState;
                        break;
                }
                break;
            case "S1_0":
                switch (finalState) {
                    case "S1_3":
                        result += startState + translate + "S1_2";
                        result += ",";
                        result += "S1_2" + translate + finalState;
                        break;
                    default:
                        result += startState + translate + finalState;
                        break;
                }
                break;
            case "S1_1":
                switch (finalState) {
                    case "S1_2":
                        result += startState + translate + "S1_0";
                        result += ",";
                        result += "S1_0" + translate + finalState;
                        break;
                    case "S1_3":
                        result += startState + translate + "S1_0";
                        result += ",";
                        result += "S1_0" + translate + "S1_2";
                        result += ",";
                        result += "S1_2" + translate + finalState;
                        break;
                    default:
                        result += startState + translate + finalState;
                        break;
                }
                break;
            case "S1_4":
                switch (finalState) {
                    case "S1_0":
                        result += startState + translate + "S1_2";
                        result += ",";
                        result += "S1_2" + translate + finalState;
                        break;
                    case "S1_3":
                        result += startState + translate + "S1_2";
                        result += ",";
                        result += "S1_2" + translate + finalState;
                        break;
                    default:
                        result += startState + translate + finalState;
                        break;
                }
                break;
            default:
                result += startState + translate + finalState;
                break;
        }
        return result;
    }
}