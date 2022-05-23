package main

import (
    "database/sql"
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/mysql"
    "fmt"
    "github.com/pkg/errors"
    "os"
    "path/filepath"
    "encoding/csv"
    "strconv"
    "io/ioutil"
)


func initDatabase(ip string, name string, user string, password string) {
    createAndConnectDatabase(ip, name, user, password)
    createTablesDialogues()
    initDialogues("../assets/files", "../assets/descriptions/", "assets/wavs/")
    initSentences("../assets/files")    
}


func initDialogues(root string, rootDescription string, rootWav string) {
    //insert dialogues
    var files []string

    err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if filepath.Ext(path) == ".csv" {
            files = append(files, path)
        }
        return nil
    })
    if err != nil {
        panic(err)
    }

    for _, file := range files {
        bytesRead, _ := ioutil.ReadFile(rootDescription + file[16 : len(file) - 3] + "txt")
        file_content := string(bytesRead)
        fmt.Println(file_content)
        fmt.Println(rootWav + file[16 : len(file) - 3] + "wav")
        dialogue := Dialogues{FilePath: rootWav + file[16 : len(file) - 3] + "wav", Description: file_content }
        success := insertDialogue(dialogue)
        if !success {
            fmt.Println("Dialogue insertion failed.")
        }   
    }  
}


func readCsvFile(filePath string) [][]string {
    f, err := os.Open(filePath)
    if err != nil {
        fmt.Println("Unable to read input file " + filePath, err)
    }
    defer f.Close()

    csvReader := csv.NewReader(f)
    records, err := csvReader.ReadAll()
    if err != nil {
        fmt.Println("Unable to parse file as CSV for " + filePath, err)
    }

    return records
}


func initSentences(root string) {
    //insert sentences
    var files []string

    err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if filepath.Ext(path) == ".csv" {
            files = append(files, path)
        }
        return nil
    })
    if err != nil {
        panic(err)
    }

    root_wav := "assets/wavs/"

    for _, file := range files {
        records := readCsvFile(file)
        var dialogue Dialogues
        result := getDialogueByPath(root_wav + file[16 : len(file) - 3] + "wav", &dialogue)

        if result.RowsAffected > 1 {
            fmt.Println(result.RowsAffected, "More than 1 dialogue returned! Please scrutinize the database.")
            return
        }else if result.RowsAffected < 1 {
            fmt.Println(result.RowsAffected, "No dialogue returned! Please scrutinize the database.")
            return
        }else {
            //create new sentence
            for i, record := range records {
            if i != 0 {
                fmt.Println(record[0]) 
                index, _ := strconv.Atoi(record[1])
                indexS, _ := strconv.Atoi(record[2])
                startTime, _ := strconv.Atoi(record[3])
                endTime, _ := strconv.Atoi(record[4])
                highlightP, _ := strconv.Atoi(record[6])
                highlightA, _ := strconv.Atoi(record[7])
                speaker := record[0][len(record[0]) - 4:len(record[0]) - 3]
                sentence := Sentences{DialogueID: dialogue.ID, Index: index, IndexS:indexS, StartTime: startTime, EndTime: endTime, Transcript: record[5], HighlightP: highlightP, HighlightA: highlightA, Speaker: speaker}
                insertSentence(sentence)
                fmt.Println(record[1])       
            }
        }
        //fmt.Println(records) 
        
        }
    }  
}


func connectDatabase(ip string, name string, user string, password string) {
    //open a db connection when initiated
    var err error
    db, err = gorm.Open("mysql", user+":"+password+"@"+ip+"/"+name+"?charset=utf8&parseTime=True&loc=Local")
    if err != nil {
        panic(errors.Wrap(err, "Failed to connect database"))
    }
}


func createDatabase(ip string, name string, user string, password string) {

    db_sql, err := sql.Open("mysql", user+":"+password+"@"+ip+"/")
    if err != nil {
        panic(err)
    }
    defer db_sql.Close()

    _,err = db_sql.Exec("CREATE DATABASE "+ name)
    if err != nil {
        panic(err)
    }

    _,err = db_sql.Exec("USE "+ name)
    if err != nil {
        panic(err)
    }
}


func createAndConnectDatabase(ip string, name string, user string, password string) {

    db_sql, err_sql := sql.Open("mysql", user+":"+password+"@"+ip+"/")
    if err_sql != nil {
        panic(err_sql)
    }
    defer db_sql.Close()

    _, err_sql = db_sql.Exec("CREATE DATABASE IF NOT EXISTS "+ name)
    if err_sql != nil {
        panic(err_sql)
    }

    _, err_sql = db_sql.Exec("USE "+ name)
    if err_sql != nil {
        panic(err_sql)
    }

    //open a db connection when initiated
    var err error
    db, err = gorm.Open("mysql", user+":"+password+"@"+ip+"/"+name+"?charset=utf8&parseTime=True&loc=Local")
    if err != nil {
        panic(errors.Wrap(err, "Failed to connect database"))
    }
}


func createTables() {
    db.AutoMigrate(&Users{}, &Assignments{}, &Labels{}, &Instances{}, &Assignments{}, &Surveys{}, &Questionnaires{})
}


func createTablesDialogues() {
    db.AutoMigrate(&Users{}, &Dialogues{}, &Sentences{}, &DialogueAssignments{}, &DialogueAnnotations{}, &SentenceAnnotations{}, &Surveys{}, &Questionnaires{})
}


func createUser(new_user Users) bool {
    db.AutoMigrate(&Users{})
    result := db.Create(&new_user) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("user creation error：", result.Error)
        return false
    }

    return true
}


func getAssignments(userName string, assignmentsPtr *[]Assignments) bool {
    var user Users
    result := getUser(userName, &user)

    if result.Error != nil {
        fmt.Println("user found error：", result.Error)
        return false
    }

    db.AutoMigrate(&Assignments{})

    result = db.Where("user_id=?", user.ID).Find(assignmentsPtr)
    if result.Error != nil {
        fmt.Println("assignments query error：", result.Error)
        return false
    }
    return true
}


func getSentences(dialogueID int, sentencesPtr *[]Sentences) bool {
    db.AutoMigrate(&Sentences{})

    result := db.Where("dialogue_id=?", dialogueID).Find(sentencesPtr)
    if result.Error != nil {
        fmt.Println("assignments query error：", result.Error)
        return false
    }
    return true
}


func getDialogueAssignment(userName string, dialogueAssignmentPtr *DialogueAssignments) bool {
    var user Users
    result := getUser(userName, &user)

    if result.Error != nil {
        fmt.Println("user found error：", result.Error)
        return false
    }

    db.AutoMigrate(&DialogueAssignments{})

    result = db.Where("user_id=?", user.ID).Find(dialogueAssignmentPtr)
    if result.Error != nil {
        fmt.Println("dialogue assignment query error：", result.Error)
        return false
    }
    return true
}


func getInstance(instanceID int, instancePtr *Instances) bool {
    
    db.AutoMigrate(&Instances{})

    result := db.First(instancePtr, instanceID)
    if result.Error != nil {
        fmt.Println("instance query error：", result.Error)
        return false
    }
    return true
}


func getDialogueByPath(filePath string, dialoguePtr *Dialogues) (*gorm.DB) {
    db.AutoMigrate(&Dialogues{})
    result := db.Where("file_path = ?", filePath).First(dialoguePtr)

    return result
}


func getDialogue(dialogueID int, dialoguePtr *Dialogues) bool {
    db.AutoMigrate(&Dialogues{})
    result := db.First(dialoguePtr, dialogueID)
    if result.Error != nil {
        fmt.Println("dialogue query error：", result.Error)
        return false
    }
    return true
}


func getUser(userName string, userPtr *Users) (*gorm.DB) {
    db.AutoMigrate(&Users{})
    result := db.Where("user_name = ?", userName).First(userPtr)

    return result
}


func updateUser(user Users) bool {
    db.AutoMigrate(&Users{})
    result := db.Save(&user)
    if result.Error != nil {
        fmt.Println("user update error：", result.Error)
        return false
    }

    return true
}


func insertInstance(instance Instances) bool {
    result := db.Create(&instance) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("user creation error：", result.Error)
        return false
    }
    return true
}


func insertDialogueAnnotation(dialogueAnnotationPtr *DialogueAnnotations) bool {
    result := db.Create(&dialogueAnnotationPtr) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("dialogue annotation insert error：", result.Error)
        return false
    }
    return true
}



func insertDialogue(dialogue Dialogues) bool {
    result := db.Create(&dialogue) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("dialogue creation error：", result.Error)
        return false
    }
    return true
}


func insertSentence(sentence Sentences) bool {
    result := db.Create(&sentence) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("sentence creation error：", result.Error)
        return false
    }
    return true
}


func insertSentenceAnnotation(sentenceAnnotation SentenceAnnotations) bool {
    result := db.Create(&sentenceAnnotation) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("sentence annotation creation error：", result.Error)
        return false
    }
    return true
}


func insertAssignment(userID int, instanceID int) bool {
    assignment := Assignments{UserID: userID, InstanceID: instanceID}
    result := db.Create(&assignment) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("assignment insertion error：", result.Error)
        return false
    }

    return true
}


func assignUser(userName string, number int) bool {
    var user Users
    result := getUser(userName, &user)

    if result.RowsAffected > 1 {
            fmt.Println(result.RowsAffected, "More than 1 user returned! Please scrutinize the database.")
            return false
    }else if result.RowsAffected < 1 {
        fmt.Println(result.RowsAffected, "No user returned! Please scrutinize the database.")
        return false
    }else {
        //create new assignment by the algorithm selected
        instance_id_list := getInstancesIDList(number)
        fmt.Println(instance_id_list)
        db.AutoMigrate(&Assignments{})
        
        for i := 0; i < len(instance_id_list); i++ {
            // perform a db.Query insert
            success := insertAssignment(user.ID, instance_id_list[i])
            if !success {
                return false
            }
        }
    }

    return true
}


func insertAssignmentDialogue(userID int) bool {

    db.AutoMigrate(&DialogueAssignments{})
    assignmentDialogue := DialogueAssignments{UserID: userID, DialogueID: dialogue_id_list[dialogue_index], Condition: condition_list[condition_index]}
    result := db.Create(&assignmentDialogue) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("dialogue assignment insertion error：", result.Error)
        return false
    }

    condition_index += 1
    if len(condition_list) == condition_index {
        condition_index = 0
        dialogue_index += 1
        if len(dialogue_id_list) == dialogue_index {
            dialogue_index = 0
        }
    }

    return true
}


func assignUserDialogue(userName string) bool {
    var user Users
    result := getUser(userName, &user)

    if result.RowsAffected > 1 {
            fmt.Println(result.RowsAffected, "More than 1 user returned! Please scrutinize the database.")
            return false
    }else if result.RowsAffected < 1 {
        fmt.Println(result.RowsAffected, "No user returned! Please scrutinize the database.")
        return false
    }else {
        //create new assignment by the algorithm selected
        fmt.Println(dialogue_id_list)
        
        success := insertAssignmentDialogue(user.ID)

        if !success {
            return false
        }
            
    }

    return true
}


func insertLabel(label Labels) bool {
    
    db.AutoMigrate(&Labels{})

    result := db.Create(&label) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("label insertion error：", result.Error)
        return false
    }
    return true
}


func insertSurvey(survey Surveys) bool {
    
    db.AutoMigrate(&Surveys{})

    result := db.Create(&survey) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("label insertion error：", result.Error)
        return false
    }
    return true
}


func insertQuestionnaire(questionnaire Questionnaires) bool {
    
    db.AutoMigrate(&Questionnaires{})

    result := db.Create(&questionnaire) // pass pointer of data to Create

    if result.Error != nil {
        fmt.Println("label insertion error：", result.Error)
        return false
    }
    return true
}


func getInstancesIDList(number int) []int {
    db.AutoMigrate(&Instances{})
    var instances []Instances
    result := db.Find(&instances)

    if result.Error != nil {
        fmt.Println("instance list read error：", result.Error)
    }
    var instance_id_list []int
    for _, instance := range instances {
        instance_id_list = append(instance_id_list, instance.ID)
    }
    fmt.Println("Instance list：", instance_id_list)
    selected_id_list := shuffle(instance_id_list, number)
    return selected_id_list
}
