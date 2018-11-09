import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Modal,
  TouchableHighlight,
  Keyboard
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import MultipleChoice from 'rn-multiple-choice';
import Amplify, { Auth, API } from 'aws-amplify';

export default class MentorApplication extends Component {
  state = {
    user_id: '',
    class_year: '0',
    gender: '0',
    major: '0',
    minors: '0',
    coop: '0',
    gpa: '0',
    grad_interested: '0',
    grad_school: '0',
    research: '0',
    honors: '0',
    interests: ['EMP'],
    weekend: '0',
    job: '0',
    agree: false,
    visible: false,
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
  }

  setStateFinal(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      let user_data = {}
      let goals = {}
      let pairings = []
      let mentor = false
      let form_data = {}
      let user = this.state['user_id']
      for (var data in this.state) {
        if (data != 'visible' && data != 'user_id')
          form_data[data] = this.state[data]
      }

      async function getData() {
        const get_response = await API.get('dynamoAPI', '/items/' + user);
        return get_response;
      }
      async function putData() {
        let put_body = {
          body: {
            userid: user,
            user_data: user_data,
            form_data: form_data,
            goals: goals,
            mentor: mentor,
            pairings: pairings
          }
        }
        const put_response = await API.put('dynamoAPI', '/items?userid=' + user, put_body);
        return put_response;
      }
      getData()
      .then((rv) => {
        console.log(rv);
        result = rv[0]
        user_data = result.user_data
        goals = result.goals
        mentor = result.mentor
        pairings = result.pairings
        console.log("Done GETTING!");
        putData()
        .then((data) => {
          this.props.navigation.state.params.onNavigateBack()
          this.props.navigation.goBack();
        });
      })
      .catch((err) => { console.log(err)});
    })
  }

  setModalVisible(visibleVal) {
    this.setState({visible: visibleVal});
  }

  setStateInterest(value) {
    if (this.state.interests.includes(value)) {
      console.log("removing " + value)
      let copy = [...this.state.interests]
      copy.splice(copy.indexOf(value), 1)
      this.setState({
        interests: copy
      })
    }
    else {
      console.log("inserting " + value)
      this.setState({
        interests: [...this.state.interests, value]
      })
    }
  }

  render () {
    let class_years = [
      {key: 'Junior', label: 'Junior Engineering Student'},
      {key: 'Senior', label: 'Senior Engineering Student'},
      {key: 'Fifth Year+', label: 'Fifth Year+ Engineering Student'}
    ];
    let genders = [
      {key: 'Male', label: 'Male'},
      {key: 'Female', label: 'Female'},
      {key: 'Other', label: 'Other'},
      {key: 'N/A', label: 'Prefer not to say'}
    ];
    let majors = [
      {key: 'Aerospace Engineering', label: 'Aerospace Engineering'},
      {key: 'Biomedical Engineering', label: 'Biomedical Engineering'},
      {key: 'Biosystems Engineering', label: 'Biosystems Engineering'},
      {key: 'Chemical Engineering', label: 'Chemical Engineering'},
      {key: 'Civil Engineering', label: 'Civil Engineering'},
      {key: 'Computer Engineering', label: 'Computer Engineering'},
      {key: 'Computer Science', label: 'Computer Science'},
      {key: 'Electrical Engineering', label: 'Electrical Engineering'},
      {key: 'Industrial Engineering', label: 'Industrial Engineering'},
      {key: 'Materials Science', label: 'Materials Science'},
      {key: 'Mechanical Engineering', label: 'Mechanical Engineering'},
      {key: 'Nuclear Engineering', label: 'Nuclear Engineering'},
      {key: 'Other', label: 'Other'}
    ];
    let coop_options = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'},
      {key: 'Maybe', label: 'Maybe'}
    ]
    let prof_options = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'},
      {key: 'Maybe', label: 'Maybe'}
    ];
    let grad_schools = [
      {key: 'None', label: 'None'},
      {key: 'Dental School', label: 'Dental School'},
      {key: 'Graduate School', label: 'Graduate School'},
      {key: 'Law School', label: 'Law School'},
      {key: 'MBA Program', label: 'MBA Program'},
      {key: 'Medical School', label: 'Medical School'},
      {key: 'Pharmacy School', label: 'Pharmacy School'},
      {key: 'Veterinary School', label: 'Veterinary School'}
    ];
    let research_involvement = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'}
    ];
    let in_honors = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'}
    ];
    let interests = [];
    let { navigation } = this.props;
    let user_id = navigation.getParam('user_id', 'NO-ID');
    console.log(user_id)
    if (this.state.user_id == '') {
      this.setState({
        user_id: user_id
      });
    }

    return (
      <ScrollView style={styles.container}>
        <Text>Class for this academic year?</Text>
        <ModalSelector
          data={class_years}
          initValue="Select"
          onChange={(option) => this.setStateHelper('class_year', option.key)} />

        <Text>Gender</Text>
        <ModalSelector
          data={genders}
          initValue="Select"
          onChange={(option) => this.setStateHelper('gender', option.key)} />

        <Text>Major</Text>
        <ModalSelector
          data={majors}
          initValue="Select"
          onChange={(option) => this.setStateHelper('major', option.key)} />

        <Text>Minors</Text>
        <TextInput
          style={styles.inputs}
          onChangeText={value => this.setStateHelper('minors', value)}
          blurOnSubmit={true}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Minors'
        />

        <Text>Do you plan on being on coop for a semester this year?</Text>
        <ModalSelector
          data={coop_options}
          initValue="Select"
          onChange={(option) => this.setStateHelper('coop', option.key)} />

        <Text>Are you interested in graduate or professional education?</Text>
        <ModalSelector
          data={prof_options}
          initValue="Select"
          onChange={(option) => this.setStateHelper('grad_interested', option.key)} />

        <Text>What type of postsecondary education?</Text>
        <ModalSelector
          data={grad_schools}
          initValue="Select"
          onChange={(option) => this.setStateHelper('grad_school', option.key)} />

        <Text>Are you involved in research at UT?</Text>
        <ModalSelector
          data={research_involvement}
          initValue="No"
          onChange={(option) => this.setStateHelper('research', option.key)} />

        <Text>Are you in an honors program? (CHP, Engineering Honors, etc)</Text>
        <ModalSelector
          data={in_honors}
          initValue="No"
          onChange={(option) => this.setStateHelper('honors', option.key)} />

        <Text>What are your interest?</Text>
        <MultipleChoice
          options={[
            'Cooking / Baking',
            'Coops / Internships',
            'Crafting / DIY / Making',
            'Entrepreneurship / Business',
            'Fitness',
            'Hiking / Backpacking',
            'Movies / TV',
            'Music',
            'Politics',
            'Research',
            'Social Media',
            'Sports',
            'Sustainability',
            'Travel',
            'Video Games'
          ]}
          onSelection={(option) => this.setStateInterest(option)
          }
        />

        <Text>What is a typical weekend like?</Text>
        <TextInput
          style={styles.inputs}
          onChangeText={value => this.setStateHelper('weekend', value)}
          blurOnSubmit={true}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Weekend'
        />

        <Text>What is your dream job?</Text>
        <TextInput
          style={styles.inputs}
          onChangeText={value => this.setStateHelper('job', value)}
          blurOnSubmit={true}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Dream Job'
        />
      <Button
        title="Terms and Conditions"
        onPress={() => {
          this.setState({ visible: true });
        }}
        />
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.terms}>
          <ScrollView>
            <Text>
              `THE UNIVERSITY OF TENNESSEE
              ENGINEERING MENTOR
              PROGRAM
              PEER MENTEE HANDBOOK
              2018-2019
              WHO AND WHAT WE ARE
              VISION
              The vision of the Engineering Mentor Program is to help end the uncertainty that new
              engineering students have about engineering disciplines. We also strive to unite the College of
              Engineering by become a professionally recognized organization which is managed by and for
              the students active or interested in that college.

              MISSION
              The mission of the Engineering Mentor Program is to facilitate a well-informed body of
              mentors to help answer the mentees’ questions about specific engineering fields, related
              industries, career paths, University of Tennessee resources, and the work ethic needed to excel in
              a given discipline.

              2

              FUNCTIONALITY
              DISCIPLINE COORDINATORS
              The general body of the Engineering Mentor Program will primarily consist of mentors
              and mentees. To manage and grow EMP, the general body will be led by a group of Executive
              Board and Discipline Coordinator positions.
              Discipline Coordinators will be broken down into four sections of 3 majors/disciplines.
              The positions are as follows: MABE Representative (Mechanical, Aerospace, Biomedical),
              Electrical Systems Representative (Electrical, Computer Science, Computer Engineering),
              Molecular Science Representative (Chemical/Biomolecular, Nuclear, Material Science), and
              Structural Representative (Industrial, Civil, Biosystems). Term lengths for Discipline
              Coordinators are 1 year, and new officers will be elected in April. Discipline Coordinators are
              also mentors and mentees and are held to the same expectations as general body mentors and
              mentees.
              Discipline Coordinators will assist the Executive Board in making decisions, help with the
              recruiting process of students from his or her respective department, and keep the mentors
              and mentees of his or her department accountable for meetings and actions. In case of
              problems or questions, the appropriate Discipline Coordinator should be your first point of
              contact.

              GENERAL LEADERSHIP
              The General Leadership board consists of the Discipline Coordinators, Recruiter, Event
              Planner, Social Media Manager, and Web Master. Each of these positions will carry a specific
              responsibility for the growth, function, and development of the program. Terms for these
              positions will last 1 year and new officers will be elected in April. General Leadership members
              are also mentors and mentees and are held to the same expectations as general body mentors
              and mentees.

              3

              EXECUTIVE BOARD
              The Executive Board will consist of 4 members under the titles of President, Vice
              President, Treasurer, and Secretary. Terms for Executive Board positions will last 1 year in
              length. The time frame for these positions will extend from Summer to Spring and elections for
              following terms will be held in April. Executive Board members are also mentors and mentees
              and are held to the same expectations as general body mentors and mentees.

              DUES
              Currently, there is a one-time $10 due for entering mentees only. This fee will be
              gathered at the beginning of the year and its value will go towards future events, material, and
              scholarships for EMP.

              MENTOR-MENTEE PAIRING
              Each mentor will be assigned a minimum of one mentee per year (Fall-Spring
                semesters). Mentor-mentee pairing is handled using a program that will make pairs based on
                similar personal and academic interests. Pairs are finalized by the Discipline Coordinators.
                Pairing will be decided using the information gathered about both mentors and mentees on the
                application for the program.
                Should a mentor or mentee wish to separate from his/her partner, the member must
                first talk to his/her respective Discipline Coordinator about the reason for separation. If no
                solution can be found for the problem, the Discipline Coordinator will then supply the mentor
                or mentee with a “Partner Separation Form”. Upon completion of this form, a mentor will be
                put onto an “Available Mentor List” and a mentee will be paired with a new mentor. If a pair is
                separated, the mentor may or may not receive a new mentee during the course of the year,
                depending on availability of unpaired mentees.

                4

                RESPONSIBILITIES
                MENTOR REQUIREMENTS
                We seek the very best students to represent and become mentors for this program.
                Additionally, the students we serve as mentees look to us for credible information regarding the
                disciplines, industries, and work ethic with which they desire to learn about. For these reasons,
                the following standards must be met and will be verified at the time of acceptance into the
                position:
                ● Minimum 60 Credit Hours (Upperclassman) in an Engineering Major
                ● Minimum 2.5 GPA and in good standing with the Academic Dean

                MEMBERSHIP & DIVERSITY
                Membership as a mentor is open to all students and faculty/staff members where
                appropriate, regardless of race, ethnicity, national origin, religion, sex, pregnancy, marital status,
                sexual orientation, gender identity, age, physical or mental disability, or covered veteran status.
                As a mentor, you will be expected to uphold the values and vision of the Engineering
                Mentor Program as it relates to diversity. Due to the expansive range of people with which this
                program effects, you will be expected to not only accept, but promote diversity within the
                organization.

                CONVERSATION CONFIDENTIALITY
                We strongly encourage the development of a trusting and productive relationship
                between you and your mentor. For this reason, conversations held between mentors and mentees
                should be kept private unless one of the following are met:
                ● Mentee/Mentor communicates problems/ideas about physical harm either to themselves
                or by another person.
                ● Mentee/Mentor communicates problems about dangerous illegal drug or alcohol usage.
                5

                ● Mentee/Mentor communicates problems/ideas about sexual abuse either by another
                person or aimed at another person.

                ATTITUDE & MINDSET
                The idea behind EMP is to help all students address career and school uncertainties, have
                a stronger support system and holistic resources, and improve discipline and self-esteem while
                retaining mentee interests. In order to make this idea a reality, however, we need your
                cooperation and participation just as much as we need the mentors who will be guiding you. To
                help you build the relationship between yourself and your mentor, a few suggestions are listed
                below.
                ● Respect each other. As EMP mentees you will be watched by faculty, classmates,
                mentors and mentees.
                ● Be honest with your mentor. If you are struggling to understand a certain concept or
                something your mentor is trying to explain to you, do yourself a favor and ask for
                clarification. Your mentor and these meetings are meant for your growth.
                ● Write down Specific, Measurable, Attainable, Realistic, and Timely (SMART) goals
                which your mentor can help you reach. By having physical goals, your mentor can not
                only help you reach your goals, but can also connect with you on a more personal level.
                ● Take responsibility and be vocal about your success. Both you and your mentor can
                benefit from knowing that you have made steps forward towards being the person you
                want to be.
                ● Be a positive team member. Nobody likes a “Debbie Downer”, if you have a good
                attitude chances are other people around you will as well.
                ● Be proactive in reaching out to your mentor. Although your mentor has the responsibility
                of setting up meetings, do not feel limited to get in contact with your mentor and ask
                questions. The more you invest in your relationship, the more you will get out of it.
                ● Have fun! Enjoy this time to get to another person with similar aspirations as you. The
                more fun you have, the less your position will feel like work.
                In addition to these suggestions, a few rules for mentor-mentee relationships are stated below. If
                any of these rules are found to be broken or are not immediately reported when found to be in
                violation, your position as a mentee can be brought into review. These rules are as follows:
                ● Sexual or romantic relationships between a mentor and mentee are not allowed during the
                term with which two are paired.
                6

                ● Assistance on coursework, aside from basic concepts and ideas, is strictly forbidden. This
                includes the giving of or copying of past notes, codes, quizzes, and exams.

                MEETING REQUIREMENTS
                To ensure that both you and your mentor get the most out of the Engineering Mentor
                Program, you will be required to meet with your mentor at least once a month in person and
                it is suggested you attend at least 2 EMP events per semester together. Your mentor will be
                given the responsibility for planning these meetings. However, if you as the mentee desire
                more time to meet just let your mentor know, and they will do their best to coordinate more
                meeting times. We encourage communication via text, phone, or email to get the best out of
                your relationship!
                Another form of meeting that can be logged is that of time spent with your mentor
                during events. Throughout the course of the year, EMP will host a variety of events ranging
                from trivia, design competitions, board game nights, and general discussions. If you attend
                these events with your mentor, both you and your mentor will receive credit for meeting that
                month.
                Mentees are eligible for extra credit from the Engineering Fundamentals department.
                Mentees are also expected attend General Body Meetings, which are held monthly and
                usually include a speaker and dinner.

                MEETING DOCUMENTATION
                To make sure that you are both upholding your responsibilities and to help with
                documentation of your service hours, post-meeting forms will be available for your mentor to
                fill out.
                The “Monthly Meeting Check In” can be found via link on an email that will be sent to
                your mentor at the beginning of the school year. The form will also be available on our website
                (utkemp.squarespace.com) or can be sent to you from your Discipline Coordinator by request.
                A copy of this form is MUST be filled out for your mentor to receive service hours for your

                7

                meeting time. Otherwise this form is now optional unless stated as a requirement for
                scholarships or other prizes offered through EMP.
                To receive service credit for “EMP Mentor-Mentee Meetings” the following rules and
                steps must be followed:
                Hours can only be logged for mentor-mentee time – not meetings.
                Hours must be reported within 30 days of service
                Verification for the 100-hour service medallion will be required
                Log Agency Name as Other, “Engineering Mentor Program (EMP)” – Verbatim
                The service coordinator contact information is the current EMP President.
                However, President him/herself must record faculty advisor as service
                coordinator.
                ● CLS contact: Brandon Davis
                The link to log service hours can be found at:
                http://leadershipandservice.utk.edu/resources_track.php
                ●
                ●
                ●
                ●
                ●

                8

                HOW TO ACCOMPLISH
                CONVERSATION & QUESTIONS
                Our reputation as engineers precedes us! Seeing as the you will begin associating with
                other engineering students, keep in mind that the art of conversation may not be at the top of
                everyone’s skill sets. Use this as an opportunity to improve your communication skills. Aside
                from the points listed below, be confident in yourself and keep in mind that the other members
                of EMP are students too, and still getting the hang of this.
                ● Ask questions about the other person. Most people like to talk about themselves. Find
                out what you have in common or are interested in that person and build on it.
                ● Talk about general interest topics. Although talking about weather may seem cliché, you
                might be surprised what conversations can become of common knowledge.
                ● Listen actively. When listening to a person, interject to paraphrase what he or she is
                saying or ask for clarification. People like to know they are being heard and that what
                they are saying is having some impact.
                ● Forget yourself. The less you think about how you look, sound, or feel, the more
                invested in the other person you will become. This also raises confidence.
                ● Tell funny stories. Most people like stories with light humor. Stories are easy ways for
                humans to relate to each other, learn, and pass time.

                9

                APPENDIX
                RESOURCE PAGE
                Engineering advisement in the EF 151-152 progression.
                Visit Engineering Advising Services http://www.engr.utk.edu/advising/
                Connecting with resources and student organizations for multicultural engineering students.
                Visit Office of Diversity Programs http://www.engr.utk.edu/diversity/
                Finding or learning more about a co-op or internship.
                Visit Engineering Professional Practice http://www.coop.utk.edu
                When you need someone besides your mentor to talk to.
                Visit Counseling Center http://counselingcenter.utk.edu
                Computer problems.
                Visit Office of Information Technology https://oit.utk.edu
                Supplemental Instruction (SI), tutoring, workshops, and more.
                Visit Student Success Center http://studentsuccess.utk.edu
                Career counseling, career exploration classes, interest and personality assessments, and resources
                to help you choose a major and career.
                Visit Career Services http://career.utk.edu/
                Interests in how to get involved in service opportunities and leadership experiences.
                Visit Center for Leadership and Service http://leadershipandservice.utk.edu/
                An understanding of what opportunities to participate in and conduct undergraduate research.
                Visit Office of Undergraduate Research http://ugresearch.utk.edu/
                10

                EXECUTIVE BOARD & DISCIPLINE REP. CONTACTS
                President

                Megan Pitz

                Vice President

                TBD April 29

                Treasurer

                TBD April 29

                Secretary

                TBD April 29

                Recruiter

                TBD April 29

                Event Planner

                TBD April 29

                Social Media Manager

                TBD April 29

                Molecular Sciences Rep

                TBD April 29

                MABE Rep

                TBD April 29

                Electrical Systems Rep

                TBD April 29

                Structural Rep

                TBD April 29

                megepitz@vols.utk.edu

                11

                `
            </Text>
            <Button
              onPress={() => {
                this.setStateFinal('agree', true);
              }}
              title="Agree"
            />
            <Button
              onPress={() => {
                this.setModalVisible(!this.state.visible)
              }}
              title="Cancel"
            />
          </ScrollView>
        </View>
      </Modal>
      <Text>I agree to the terms and conditions.</Text>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom: 50
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  inputs: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  }
});
