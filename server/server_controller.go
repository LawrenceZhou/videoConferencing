package main

import (
	"fmt"
	"strings"
	"strconv"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/contrib/static"
	"github.com/pkg/errors"  //Adding context to errors
)

func webServer(ip string, name string, user string, password string) {

	connectDatabase(ip, name, user, password)

	r := gin.Default()

	r.Use(static.Serve("/",static.LocalFile("../templates", true)))

	r.Static("/assets", "../assets")

	api := r.Group("/api/v1")
	{
		//login checking
		api.POST("/log_in", loginHandler)
		//get user status
		api.POST("/get_status", getStatusHandler) 
		//save label
		api.POST("/save_label", saveLabelHandler) 
		//save comparison label
		api.POST("/save_label_comparison", saveLabelComparisonHandler) 
		//get instance list
		api.POST("/get_list", getListHandler)
		//get tasks
		api.POST("/get_tasks", getTasksHandler)
		//save survey
		api.POST("/save_survey", saveSurveyHandler)
		//save questionnaire
		api.POST("/save_questionnaire", saveQuestionnaireHandler)
		//finish practice
		api.POST("/finish_practice",finishPracticeHandler)
		//fget condition
		api.POST("/get_condition",getConditionHandler)
	}

	r.Run()
}


//login checking
func loginHandler(c *gin.Context) {
	//completed checking if already sent a response
	completed:= false

	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)
	timeStamp := c.PostForm("timeStamp")
	fmt.Printf("timeStamp: %s \n", timeStamp)

	var user Users
	result := getUser(userName, &user)
	
	if result.RowsAffected >= 1 {
		if !completed {
			c.JSON(http.StatusOK, gin.H {
				"message": "login success!",
				"status": user.IsFinished,
			})
			completed = true
		}
	}else {
		//create new user
		new_user := Users{UserName: userName, Password: "label", CreatedTimestamp: timeStamp, IsFinished: 0}
		success := createUser(new_user)
		
		if !completed && !success {
			//user creation failed	
			c.JSON(http.StatusNotFound, gin.H {
				"message": "User creation Failed!",
			})
			completed = true      
		}


		//generate assignment
		//success = assignUser(userName, assignmentNumber)
		//generate dialogue assignment
		success = assignUserDialogue(userName)
    	if !completed && !success {
			//assignment failed	
			c.JSON(http.StatusNotFound, gin.H {
				"message": "Assignment Failed!",
			})
			completed = true      
		}

    	if !completed {
	    	c.JSON(http.StatusOK, gin.H {
				"message": "Login Succeeded!",
				"status" : 0,
			})
    		completed = true
    	}
	}

}



//get user status
func getStatusHandler(c *gin.Context) {

	completed := false

	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)

	var user Users
	result := getUser(userName, &user)
	
	if result.RowsAffected >= 1 {
		if !completed {
			c.JSON(http.StatusOK, gin.H {
				"message": "user status retrieved!",
				"status": user.IsFinished,
			})
			completed = true
		}
	
	}else {
	    c.JSON(http.StatusNotFound, gin.H {
			"message": "User not found!",
			"status" : 0,
		})
    	completed = true
    }
}


func saveLabelHandler(c *gin.Context) {

	completed:= false

	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)
	instanceID, _ := strconv.Atoi(c.PostForm("ID"))
	fmt.Printf("instanceID: %d \n", instanceID)
	selectedPleasure, _ := strconv.Atoi(c.PostForm("selectedPleasure"))
	fmt.Printf("selectedPleasure: %d \n", selectedPleasure)
	selectedArousal, _ := strconv.Atoi(c.PostForm("selectedArousal"))
	fmt.Printf("selectedArousal: %d \n", selectedArousal)
	selectedDominance, _ := strconv.Atoi(c.PostForm("selectedDominance"))
	fmt.Printf("selectedDominance: %d \n", selectedDominance)
	clickCountPleasure, _ := strconv.Atoi(c.PostForm("clickCountPleasure"))
	fmt.Printf("clickCountPleasure: %d \n", clickCountPleasure)
	clickCountArousal, _ := strconv.Atoi(c.PostForm("clickCountArousal"))
	fmt.Printf("clickCountArousal: %d \n", clickCountArousal)
	clickCountDominance, _ := strconv.Atoi(c.PostForm("clickCountDominance"))
	fmt.Printf("clickCountDominance: %d \n", clickCountDominance)
	timeUsage, _ := strconv.Atoi(c.PostForm("timeUsage"))
	fmt.Printf("timeUsage: %d \n", timeUsage)
	timeStamp := c.PostForm("timeStamp")
	fmt.Printf("timeStamp: %s \n", timeStamp)
	var isConflicted int
	if c.PostForm("isInconsistent") == "true" {
		isConflicted = 1
	}else {
		isConflicted = 0
	}
	fmt.Printf("isInconsistent: %d \n", isConflicted)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		fmt.Println("error：", result.Error)
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}
		
	//need to revise; just for debugging
	user.IsFinished = 3

	success := updateUser(user)
		
	if !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Not Found!",
		})
		completed = true
	}
	/////////////////////

	fmt.Printf("user: %#v\n", user)
	fmt.Printf("userID: %d\n", user.ID)
    	
    label := Labels{UserID: user.ID, InstanceID: instanceID, IsConflicted: isConflicted, Timestamp: timeStamp, TimeUsage: timeUsage, ChangeTimesP: clickCountPleasure, ChangeTimesA: clickCountArousal, ChangeTimesD: clickCountDominance, ValueP: selectedPleasure, ValueA: selectedArousal, ValueD: selectedDominance}
	success = insertLabel(label)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Insertion Failed!",
		})
		completed = true      
	}

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Insertion Succeeded!",
		})
	}
}


func saveLabelComparisonHandler(c *gin.Context) {

	completed:= false
	
	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)
	dialogueAssignmentID, _ := strconv.Atoi(c.PostForm("dialogueAssignmentID"))
	fmt.Printf("dialogueAssignmentID: %d \n", dialogueAssignmentID)
	typeSubmit := c.PostForm("typeSubmit")
	fmt.Printf("typeSubmit: %s \n", typeSubmit)
	dimension := c.PostForm("dimension")
	fmt.Printf("dimension: %s \n", dimension)
	speaker := c.PostForm("speaker")
	fmt.Printf("speaker: %s \n", speaker)
	timeUsage, _ := strconv.Atoi(c.PostForm("timeUsage"))
	fmt.Printf("timeUsage: %d \n", timeUsage)
	timeStamp := c.PostForm("timeStamp")
	fmt.Printf("timeStamp: %s \n", timeStamp)
	sentenceIDs_ := c.PostFormArray("sentenceIDs")
	sentenceIDs := strings.Split(sentenceIDs_[0], ",")
	fmt.Println("sentenceIDs: ", sentenceIDs, len(sentenceIDs))
	results_ := c.PostFormArray("results")
	results := strings.Split(results_[0], ",")
	fmt.Println("results: ", results, len(results))
	rewindTimes, _ := strconv.Atoi(c.PostForm("rewindTimes"))
	fmt.Printf("rewindTimes: %d \n", rewindTimes)

	/////////////////////
    	
    dialogueAnnotation := DialogueAnnotations{DialogueAssignmentID: dialogueAssignmentID, Speaker: speaker, Dimension: dimension, Timestamp: timeStamp, TimeUsage: timeUsage, RewindTimes: rewindTimes}
	success := insertDialogueAnnotation(&dialogueAnnotation)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Dialogue Annotation Insertion Failed!",
		})
		completed = true      
	}
	fmt.Printf("dialogueAnnotation id: %d \n", dialogueAnnotation.ID)
	fmt.Println(len(sentenceIDs), len(results))

	for i := 0; i < len(sentenceIDs); i++ {
		sentenceID, _ := strconv.Atoi(sentenceIDs[i])
		result, _ := strconv.Atoi(results[i])
		sentenceAnnotation := SentenceAnnotations{DialogueAnnotationID: dialogueAnnotation.ID, SentenceID: sentenceID, Result: result}

		success := insertSentenceAnnotation(sentenceAnnotation)
		if !completed && !success {
			c.JSON(http.StatusNotFound, gin.H {
				"message": "Sentence Annotation Insertion Failed!",
			})
			completed = true      
		}
	}

	fmt.Println(typeSubmit)

	if typeSubmit == "submit" {
		fmt.Println(typeSubmit, userName)
		var user Users
		r := getUser(userName, &user)

		if r.Error != nil {
			//username not found
			fmt.Println("error：", r.Error)
			c.JSON(http.StatusNotFound, gin.H {
				"message": "User Unauthorized!",
			})
		completed = true
		}

		user.IsFinished = 2

		success = updateUser(user)
		
		if !success {
			c.JSON(http.StatusNotFound, gin.H {
				"message": "User Not Found!",
			})
		completed = true
		}
	}

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Insertion Succeeded!",
		})
	}
}


func saveSurveyHandler(c *gin.Context) {

	completed:= false

	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)
	age := c.PostForm("age")
	fmt.Printf("age: %s \n", age)
	gender := c.PostForm("gender")
	fmt.Printf("gender: %s \n", gender)
	ethnicity := c.PostForm("ethnicity")
	fmt.Printf("ethnicity: %s \n", ethnicity)
	nationality := c.PostForm("nationality")
	fmt.Printf("nationality: %s \n", nationality)
	education := c.PostForm("education")
	fmt.Printf("education: %s \n", education)
	income := c.PostForm("income")
	fmt.Printf("income: %s \n", income)
	religion := c.PostForm("religion")
	fmt.Printf("religion: %s \n", religion)
	comprehension := c.PostForm("comprehension")
	fmt.Printf("comprehension: %s \n", comprehension)
	comprehensionLevel := c.PostForm("comprehensionLevel")
	fmt.Printf("comprehensionLevel: %s \n", comprehensionLevel)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		fmt.Println("error：", result.Error)
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}

	user.IsFinished = 4

	success := updateUser(user)
		
	if !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Not Found!",
		})
		completed = true
	}

	fmt.Printf("user: %#v\n", user)
	fmt.Printf("userID: %d\n", user.ID)
		
	survey := Surveys{UserID: user.ID, Age: age, Gender: gender, Ethnicity: ethnicity, Nationality:nationality, Education: education, Income: income, Religion: religion, Comprehension: comprehension, ComprehensionLevel: comprehensionLevel}
	success = insertSurvey(survey)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Insertion Failed!",
		})
		completed = true      
	}

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Submission Succeeded!",
		})
	}
}


func saveQuestionnaireHandler(c *gin.Context) {

	completed:= false

	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)
	easiness , _ := strconv.Atoi(c.PostForm("easiness"))
	fmt.Printf("easiness: %d \n", easiness)
	learning, _ := strconv.Atoi(c.PostForm("learning"))
	fmt.Printf("learning: %d \n", learning)
	intuitiveness, _ := strconv.Atoi(c.PostForm("intuitiveness"))
	fmt.Printf("intuitiveness: %d \n", intuitiveness)
	helpness, _ := strconv.Atoi(c.PostForm("helpness"))
	fmt.Printf("helpness: %d \n", helpness)
	easinessReason := c.PostForm("easinessReason")
	fmt.Printf("easinessReason: %s \n", easinessReason)
	learningReason := c.PostForm("learningReason")
	fmt.Printf("learningReason: %s \n", learningReason)
	intuitivenessReason := c.PostForm("intuitivenessReason")
	fmt.Printf("intuitivenessReason: %s \n", intuitivenessReason)
	helpnessReason := c.PostForm("helpnessReason")
	fmt.Printf("helpnessReason: %s \n", helpnessReason)
	advantageComment := c.PostForm("advantageComment")
	fmt.Printf("advantageComment: %s \n", advantageComment)
	disadvantageComment := c.PostForm("disadvantageComment")
	fmt.Printf("disadvantageComment: %s \n", disadvantageComment)
	otherComment := c.PostForm("otherComment")
	fmt.Printf("otherComment: %s \n", otherComment)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		fmt.Println("error：", result.Error)
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}

	user.IsFinished = 3

	success:= updateUser(user)

	if !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Not Found!",
		})
		completed = true
	}
		
	fmt.Printf("user: %#v\n", user)
	fmt.Printf("userID: %d\n", user.ID)

	questionnaire := Questionnaires{UserID: user.ID, Easiness: easiness, Learning: learning, Intuitiveness: intuitiveness, Helpness: helpness,  EasinessReason: easinessReason, LearningReason: learningReason, IntuitivenessReason: intuitivenessReason, HelpnessReason: helpnessReason, AdvantageComment: advantageComment, DisadvantageComment: disadvantageComment, OtherComment: otherComment}

	success = insertQuestionnaire(questionnaire)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Insertion Failed!",
		})
		completed = true      
	}

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Submission Succeeded!",
		})
	}
}


func finishPracticeHandler(c *gin.Context) {

	completed:= false

	userName := c.PostForm("userName")
	fmt.Printf("userName: %s \n", userName)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		fmt.Println("error：", result.Error)
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}

	user.IsFinished = 1

	success := updateUser(user)
		
	if !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Not Found!",
		})
		completed = true
	}


	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Practice Succeeded!",
		})
	}
}


func getListHandler(c *gin.Context) {
		
	completed := false

	userName:= c.PostForm("userName")
	fmt.Println("UserName:", userName)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		errors.Wrap(result.Error, "User unauthorized")
		fmt.Println("error：", errors.Wrap(result.Error, "open foo.txt failed"))
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}
	
	fmt.Printf("user: %#v\n", user)
	fmt.Printf("userID: %d\n", user.ID)

	var assignments []Assignments
		
	success := getAssignments(userName, &assignments)

	if !completed && !success || len(assignments) == 0 {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Assignments not found!",
		})
		completed = true
	}
		
	var instance_to_return []Instances
		
	db.AutoMigrate(&Instances{})
	for _, assignment := range assignments {
		var instance Instances
		fmt.Printf("assignment: %#v\n", assignment)

		success = getInstance(assignment.InstanceID, &instance)
		if !completed && !success {
			completed = true
		} else {
			fmt.Println("[new] instance:", instance)
			instance_to_return = append(instance_to_return, instance)
		}
	}

	fmt.Println("instance list: ", instance_to_return)

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"instance_list": instance_to_return,
		})
	}
}


func getTasksHandler(c *gin.Context) {
		
	completed := false

	userName:= c.PostForm("userName")
	fmt.Println("UserName:", userName)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		errors.Wrap(result.Error, "User unauthorized")
		fmt.Println("error：", errors.Wrap(result.Error, "open foo.txt failed"))
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}
	
	fmt.Printf("user: %#v\n", user)
	fmt.Printf("userID: %d\n", user.ID)

	var dialogueAssignment DialogueAssignments
		
	success := getDialogueAssignment(userName, &dialogueAssignment)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Dialogue Assignments not found!",
		})
		completed = true
	}

	var dialogue Dialogues
	success = getDialogue(dialogueAssignment.DialogueID, &dialogue)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Dialogue not found!",
		})
		completed = true
	}

	var sentences []Sentences
	success = getSentences(dialogueAssignment.DialogueID, &sentences)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Sentences not found!",
		})
		completed = true
	}

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Task Retrived!",
			"dialogue_path": dialogue.FilePath,
			"dialogue_description": dialogue.Description,
			"condition": dialogueAssignment.Condition,
			"assignment_id": dialogueAssignment.ID,
			"sentences": sentences,
		})
	}
}


func getConditionHandler(c *gin.Context) {
		
	completed := false

	userName:= c.PostForm("userName")
	fmt.Println("UserName:", userName)

	var user Users
	result := getUser(userName, &user)

	if result.Error != nil {
		//username not found
		errors.Wrap(result.Error, "User unauthorized")
		fmt.Println("error：", errors.Wrap(result.Error, "open foo.txt failed"))
		c.JSON(http.StatusNotFound, gin.H {
			"message": "User Unauthorized!",
		})
		completed = true
	}
	
	fmt.Printf("user: %#v\n", user)
	fmt.Printf("userID: %d\n", user.ID)

	var dialogueAssignment DialogueAssignments
		
	success := getDialogueAssignment(userName, &dialogueAssignment)

	if !completed && !success {
		c.JSON(http.StatusNotFound, gin.H {
			"message": "Dialogue Assignments not found!",
		})
		completed = true
	}

	if !completed {
		c.JSON(http.StatusOK, gin.H {
			"message": "Condition Retrived!",
			"condition": dialogueAssignment.Condition,
		})
	}
}
