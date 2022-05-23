package main

type (
    //Users schema in mysql
    Users struct {
        ID     int                `gorm:"AUTO_INCREMENT"`                                        //`json:"id"`
        UserName string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`  //`json:"user_name"`
        Password string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`  //`json:"password"`
        CreatedTimestamp string   `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`  //`json:"created_timestamp"`
        IsFinished int                                                                          //`json:"is_finished"`
    }

    //Instances schema in mysql
    Instances struct {
        ID     int                `gorm:"AUTO_INCREMENT"` //`json:"id"`
        FilePath string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`           //`json:"file_path"`
        SynthesisPath string      `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`        //`json:"password"`
        DefaultValueP int                  //`json:"default_value_p"`
        DefaultValueA int                  //`json:"default_value_a"`
        DefaultValueD int                  //`json:"default_value_d"`
    }

    //Assignments schema in mysql
    Assignments struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        UserID int                         //`json:"user_id"`
        InstanceID int                     //`json:"instance_id"`
    }

    //Labels schema in mysql
    Labels struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        InstanceID int                     //`json:"instance_id"`
        UserID int                         //`json:"user_id"`
        IsConflicted int                   //`json:"is_conflicted"`
        Timestamp string            `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`       //`json:"timestamp"`
        TimeUsage int                      //`json:"time_usage"`
        ChangeTimesP int                   //`json:"change_times_p"`
        ChangeTimesA int                   //`json:"change_times_a"`
        ChangeTimesD int                   //`json:"change_times_d"`
        ValueP int                         //`json:"value_p"`
        ValueA int                         //`json:"value_a"`
        ValueD int                         //`json:"value_d"`
    }

    //Surveys schema in mysql
    Surveys struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        UserID int                         //`json:"user_id"`
        Age string            `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`             //`json:"age"`
        Gender string         `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`             //`json:"gender"`
        Ethnicity string       `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`            //`json:"ethnicity"`
        Nationality string     `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`            //`json:"nationality"`
        Education string   `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`           //`json:"education"`
        Income string     `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`            //`json:"income"`
        Religion string     `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`            //`json:"religion"`
        Comprehension string     `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`            //`json:"comprehension"`
        ComprehensionLevel string     `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`            //`json:"comprehension_level"`
    }

    //Questionnaires schema in mysql
    Questionnaires struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        UserID int                         //`json:"user_id"`
        Easiness int                       //`json:"easiness"`
        Learning int                   //`json:"learning"`
        Intuitiveness int                       //`json:"intuitiveness"`
        Helpness int                       //`json:"helpness"`
        EasinessReason string         `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`              //`json:"easiness_reason"`
        LearningReason string         `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`              //`json:"learning_reason"`
        IntuitivenessReason string         `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`              //`json:"intuitiveness_reason"`
        HelpnessReason string         `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`              //`json:"helpness_reason"`
        AdvantageComment string       `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`     //`json:"advantage_comment"`
        DisadvantageComment string    `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`     //`json:"disadvantage_comment"`
        OtherComment string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`     //`json:"other_comment"`
    }

    //Dialogues schema in mysql
    Dialogues struct {
        ID     int                `gorm:"AUTO_INCREMENT"` //`json:"id"`
        FilePath string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`           //`json:"file_path"`
        Description string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`           //`json:"description"`
    }

    //Sentences schema in mysql
    Sentences struct {
        ID     int                `gorm:"AUTO_INCREMENT"` //`json:"id"`
        DialogueID      int                               //`json:"dialogue_id"`
        Index      int                               //`json:"index"`
        IndexS      int                               //`json:"index_s"`
        StartTime      int                               //`json:"start_time"`
        EndTime      int                               //`json:"end_time"`
        HighlightA      int                               //`json:"highlight_a"`
        HighlightP      int                               //`json:"highlight_p"`
        Speaker      string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`           //`json:"speaker"`
        Transcript      string           `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`           //`json:"transcript"`
    }

    //DialogueAssignments schema in mysql
    DialogueAssignments struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        UserID int                         //`json:"user_id"`
        DialogueID int                     //`json:"dialogue_id"`
        Condition string            `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`                      //`json: "condition"` 
    }

    //DialogueAnnotations schema in mysql
    DialogueAnnotations struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        Dimension string            `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`                     //`json:"dimension"`
        Speaker string            `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`                     //`json:"speaker"`
        DialogueAssignmentID int                     //`json:"dialogue_assignment_id"`
        Timestamp string            `sql:"type:TEXT CHARACTER SET utf8 COLLATE utf8_general_ci"`       //`json:"timestamp"`
        TimeUsage int                      //`json:"time_usage"`
        RewindTimes int                      //`json:"rewind_times"`
    }

    //SentenceAnnotations schema in mysql
    SentenceAnnotations struct {
        ID     int `gorm:"AUTO_INCREMENT"` //`json:"id"`
        DialogueAnnotationID        int                     //`json:"dialogue_annotation_id"`
        SentenceID        int                     //`json:"sentence_id"`
        Result      int                   //`json:"result"`
    }

)
